import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (rawUrl || '').trim();
const supabaseAnonKey = (rawKey || '').trim();

// Check if credentials are provided and not dummy placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

/**
 * Transforms database record into app link model
 */
export function mapRowToLink(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: row.title || 'Resource Link',
    url: row.url,
    description: row.description || '',
    tag: row.tag || 'Live Resource',
    category: row.category || 'web',
    pinned: Boolean(row.pinned),
    addedAt: row.added_at || 'Class Resource',
    createdAt: row.created_at || null,
  };
}

/**
 * Transforms app link model into database row
 */
export function mapLinkToRow(link) {
  return {
    id: String(link.id),
    title: link.title,
    url: link.url,
    description: link.description || '',
    tag: link.tag || 'Live Resource',
    category: link.category || 'web',
    pinned: Boolean(link.pinned),
    added_at: link.addedAt || 'Class Resource',
  };
}

/**
 * Fetch all class links from Supabase
 */
export async function fetchDbLinks() {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  try {
    const { data, error } = await supabase
      .from('class_links')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data || []).map(mapRowToLink), error: null };
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return { data: null, error: err };
  }
}

/**
 * Insert a single link
 */
export async function insertDbLink(link) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  try {
    const row = mapLinkToRow(link);
    const { data, error } = await supabase
      .from('class_links')
      .insert([row])
      .select()
      .single();

    if (error) throw error;
    return { data: mapRowToLink(data), error: null };
  } catch (err) {
    console.error('Supabase insert error:', err);
    return { data: null, error: err };
  }
}

/**
 * Bulk insert multiple links
 */
export async function insertDbLinksBulk(links) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  try {
    const rows = links.map(mapLinkToRow);
    const { data, error } = await supabase
      .from('class_links')
      .insert(rows)
      .select();

    if (error) throw error;
    return { data: (data || []).map(mapRowToLink), error: null };
  } catch (err) {
    console.error('Supabase bulk insert error:', err);
    return { data: null, error: err };
  }
}

/**
 * Update a link (e.g. pinned state)
 */
export async function updateDbLink(id, updates) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  try {
    const dbUpdates = {};
    if ('pinned' in updates) dbUpdates.pinned = Boolean(updates.pinned);
    if ('title' in updates) dbUpdates.title = updates.title;
    if ('url' in updates) dbUpdates.url = updates.url;
    if ('description' in updates) dbUpdates.description = updates.description;
    if ('tag' in updates) dbUpdates.tag = updates.tag;
    if ('category' in updates) dbUpdates.category = updates.category;

    const { data, error } = await supabase
      .from('class_links')
      .update(dbUpdates)
      .eq('id', String(id))
      .select()
      .single();

    if (error) throw error;
    return { data: mapRowToLink(data), error: null };
  } catch (err) {
    console.error('Supabase update error:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete a link by ID
 */
export async function deleteDbLink(id) {
  if (!supabase) return { error: new Error('Supabase not configured') };

  try {
    const { error } = await supabase
      .from('class_links')
      .delete()
      .eq('id', String(id));

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Supabase delete error:', err);
    return { error: err };
  }
}

/**
 * Delete all links
 */
export async function clearAllDbLinks() {
  if (!supabase) return { error: new Error('Supabase not configured') };

  try {
    const { error } = await supabase
      .from('class_links')
      .delete()
      .neq('id', '___non_existent_id___');

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Supabase clear all error:', err);
    return { error: err };
  }
}

/**
 * Subscribe to realtime changes on class_links table
 * Uses unique channel ID per listener to prevent "cannot add postgres_changes callbacks after subscribe()" error
 */
export function subscribeToClassLinks(onPayload) {
  if (!supabase) return () => {};

  try {
    const channelTopic = `class_links_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const channel = supabase
      .channel(channelTopic)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'class_links' },
        (payload) => {
          if (typeof onPayload === 'function') {
            try {
              onPayload(payload);
            } catch (err) {
              console.warn('Realtime payload handling error:', err);
            }
          }
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        // Safe channel cleanup
      }
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
}

/**
 * Subscribe to direct realtime broadcast drops for the Online Clipboard
 */
export function subscribeToClipboardBroadcast(onMessage) {
  if (!supabase) return () => {};

  try {
    const channelTopic = `clipboard_drop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const channel = supabase
      .channel(channelTopic)
      .on('broadcast', { event: 'clipboard_drop' }, (payload) => {
        if (typeof onMessage === 'function') {
          try {
            onMessage(payload.payload);
          } catch (err) {
            console.warn('Broadcast message handling error:', err);
          }
        }
      })
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        // Safe channel cleanup
      }
    };
  } catch (err) {
    console.warn('Broadcast subscription error:', err);
    return () => {};
  }
}

/**
 * Broadcast an instant clipboard drop to all active browsers
 */
export async function broadcastClipboardDrop(item) {
  if (!supabase) return;
  try {
    const channelTopic = `clipboard_drop_send_${Date.now()}`;
    const channel = supabase.channel(channelTopic);
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        try {
          await channel.send({
            type: 'broadcast',
            event: 'clipboard_drop',
            payload: item,
          });
        } finally {
          supabase.removeChannel(channel);
        }
      }
    });
  } catch (err) {
    console.warn('Broadcast send error:', err);
  }
}

/**
 * Fetch remote 4-digit passcode from Supabase if stored
 * Defaults to local configuration to avoid 404 queries on missing tables
 */
export async function fetchRemotePasscode() {
  return null;
}

/**
 * Update remote 4-digit passcode in Supabase
 */
export async function updateRemotePasscode(newCode) {
  return false;
}
