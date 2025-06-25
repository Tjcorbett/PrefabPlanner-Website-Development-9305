import supabase from '../lib/supabase'

// User Profile Management
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles_8472')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles_8472')
      .upsert({
        user_id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const uploadProfileAvatar = async (userId, file) => {
  try {
    // For demo purposes, convert to base64
    // In production, use Supabase Storage
    const reader = new FileReader()
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const { data, error } = await supabase
            .from('user_profiles_8472')
            .upsert({
              user_id: userId,
              avatar_url: e.target.result,
              updated_at: new Date().toISOString()
            })
            .select()
            .single()
          
          if (error) throw error
          resolve({ data, error: null })
        } catch (error) {
          reject({ data: null, error: error.message })
        }
      }
      
      reader.onerror = () => {
        reject({ data: null, error: 'Failed to read file' })
      }
      
      reader.readAsDataURL(file)
    })
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// User Preferences Management
export const getUserPreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences_9283')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    
    // Convert array to object for easier access
    const preferences = {}
    data.forEach(pref => {
      preferences[pref.preference_key] = pref.preference_value
    })
    
    return { data: preferences, error: null }
  } catch (error) {
    return { data: {}, error: error.message }
  }
}

export const updateUserPreference = async (userId, key, value) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences_9283')
      .upsert({
        user_id: userId,
        preference_key: key,
        preference_value: value,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updateMultiplePreferences = async (userId, preferences) => {
  try {
    const updates = Object.entries(preferences).map(([key, value]) => ({
      user_id: userId,
      preference_key: key,
      preference_value: value,
      updated_at: new Date().toISOString()
    }))
    
    const { data, error } = await supabase
      .from('user_preferences_9283')
      .upsert(updates)
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Get user's message count for badge
export const getUserMessageCount = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('messages_inbox_4729')
      .select('id, status')
      .eq('recipient_id', userId)
      .eq('status', 'unread')
    
    if (error) throw error
    return { count: data.length, error: null }
  } catch (error) {
    return { count: 0, error: error.message }
  }
}