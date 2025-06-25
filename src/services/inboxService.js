import supabase from '../lib/supabase'

// Messages Management
export const getMessages = async (userId, userType) => {
  try {
    const { data, error } = await supabase
      .from('messages_inbox_4729')
      .select(`
        *,
        attachments:attachments_inbox_8573(*)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

export const sendMessage = async (messageData) => {
  try {
    const { data, error } = await supabase
      .from('messages_inbox_4729')
      .insert([{
        sender_id: messageData.senderId,
        sender_name: messageData.senderName,
        sender_email: messageData.senderEmail,
        sender_type: messageData.senderType,
        recipient_id: messageData.recipientId,
        recipient_name: messageData.recipientName,
        recipient_email: messageData.recipientEmail,
        recipient_type: messageData.recipientType,
        subject: messageData.subject,
        message: messageData.message,
        message_type: messageData.messageType || 'direct',
        priority: messageData.priority || 'normal',
        thread_id: messageData.threadId,
        parent_message_id: messageData.parentMessageId
      }])
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const markMessageAsRead = async (messageId) => {
  try {
    const { data, error } = await supabase
      .from('messages_inbox_4729')
      .update({ status: 'read' })
      .eq('id', messageId)
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deleteMessage = async (messageId) => {
  try {
    const { error } = await supabase
      .from('messages_inbox_4729')
      .delete()
      .eq('id', messageId)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Conversations Management
export const getConversations = async (userId, userType) => {
  try {
    const { data, error } = await supabase
      .from('conversations_inbox_3947')
      .select('*')
      .contains('participants', [{ id: userId }])
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

export const createConversation = async (conversationData) => {
  try {
    const { data, error } = await supabase
      .from('conversations_inbox_3947')
      .insert([{
        participants: conversationData.participants,
        subject: conversationData.subject,
        created_by: conversationData.createdBy
      }])
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// File Upload Functions
export const uploadFile = async (file, messageId, uploadedBy) => {
  try {
    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `message-attachments/${fileName}`
    
    // For now, we'll simulate file upload and store as base64
    // In production, you'd upload to Supabase Storage
    const reader = new FileReader()
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          // Store file info in attachments table
          const { data, error } = await supabase
            .from('attachments_inbox_8573')
            .insert([{
              message_id: messageId,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              file_url: e.target.result, // Base64 for demo
              storage_path: filePath,
              uploaded_by: uploadedBy
            }])
            .select()
          
          if (error) throw error
          resolve({ data: data[0], error: null })
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

export const getAttachments = async (messageId) => {
  try {
    const { data, error } = await supabase
      .from('attachments_inbox_8573')
      .select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

// Search and Filter Functions
export const searchMessages = async (userId, query, filters = {}) => {
  try {
    let queryBuilder = supabase
      .from('messages_inbox_4729')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    
    if (query) {
      queryBuilder = queryBuilder.or(
        `subject.ilike.%${query}%,message.ilike.%${query}%,sender_name.ilike.%${query}%`
      )
    }
    
    if (filters.status) {
      queryBuilder = queryBuilder.eq('status', filters.status)
    }
    
    if (filters.priority) {
      queryBuilder = queryBuilder.eq('priority', filters.priority)
    }
    
    if (filters.messageType) {
      queryBuilder = queryBuilder.eq('message_type', filters.messageType)
    }
    
    const { data, error } = await queryBuilder.order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

// Get dealers for messaging
export const getDealersForMessaging = async () => {
  try {
    const { data, error } = await supabase
      .from('dealers_admin_7462')
      .select('id, business_name, contact_name, email, phone, city, state')
      .eq('status', 'active')
      .order('business_name')
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

// Logo Upload Function
export const uploadLogo = async (file) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `logo.${fileExt}`
    const filePath = `logos/${fileName}`
    
    // Convert to base64 for demo (in production, use Supabase Storage)
    const reader = new FileReader()
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          // Update settings with logo URL
          const { data, error } = await supabase
            .from('settings_admin_9384')
            .upsert({
              logo_url: e.target.result,
              logo_storage_path: filePath,
              updated_at: new Date().toISOString()
            })
            .select()
          
          if (error) throw error
          resolve({ data: data[0], error: null })
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

export const getLogo = async () => {
  try {
    const { data, error } = await supabase
      .from('settings_admin_9384')
      .select('logo_url, logo_storage_path')
      .limit(1)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}