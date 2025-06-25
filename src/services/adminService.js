import supabase from '../lib/supabase'

// Check if Supabase is properly configured
const isSupabaseConnected = () => {
  return true // Now connected to live Supabase
}

// Users Management
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users_admin_2847')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching users:', error.message)
    return { data: [], error: error.message }
  }
}

export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users_admin_2847')
      .insert([{
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status || 'active',
        phone: userData.phone,
        company: userData.company,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip
      }])
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updateUser = async (id, userData) => {
  try {
    const { data, error } = await supabase
      .from('users_admin_2847')
      .update({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        phone: userData.phone,
        company: userData.company,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        zip: userData.zip,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deleteUser = async (id) => {
  try {
    const { error } = await supabase
      .from('users_admin_2847')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Pages Management
export const getPages = async () => {
  try {
    const { data, error } = await supabase
      .from('pages_admin_5839')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching pages:', error.message)
    return { data: [], error: error.message }
  }
}

export const createPage = async (pageData) => {
  try {
    const { data, error } = await supabase
      .from('pages_admin_5839')
      .insert([{
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        meta_title: pageData.metaTitle,
        meta_description: pageData.metaDescription,
        status: pageData.status || 'draft',
        author_id: pageData.authorId
      }])
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updatePage = async (id, pageData) => {
  try {
    const { data, error } = await supabase
      .from('pages_admin_5839')
      .update({
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        meta_title: pageData.metaTitle,
        meta_description: pageData.metaDescription,
        status: pageData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deletePage = async (id) => {
  try {
    const { error } = await supabase
      .from('pages_admin_5839')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const getPageBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('pages_admin_5839')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Dealers Management
export const getDealers = async () => {
  try {
    const { data, error } = await supabase
      .from('dealers_admin_7462')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching dealers:', error.message)
    return { data: [], error: error.message }
  }
}

export const createDealer = async (dealerData) => {
  try {
    const { data, error } = await supabase
      .from('dealers_admin_7462')
      .insert([{
        business_name: dealerData.businessName,
        contact_name: dealerData.contactName,
        email: dealerData.email,
        phone: dealerData.phone,
        address: dealerData.address,
        city: dealerData.city,
        state: dealerData.state,
        zip: dealerData.zip,
        website: dealerData.website,
        license_number: dealerData.licenseNumber,
        specialties: dealerData.specialties || [],
        description: dealerData.description,
        status: dealerData.status || 'pending'
      }])
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updateDealer = async (id, dealerData) => {
  try {
    const { data, error } = await supabase
      .from('dealers_admin_7462')
      .update({
        business_name: dealerData.businessName,
        contact_name: dealerData.contactName,
        email: dealerData.email,
        phone: dealerData.phone,
        address: dealerData.address,
        city: dealerData.city,
        state: dealerData.state,
        zip: dealerData.zip,
        website: dealerData.website,
        license_number: dealerData.licenseNumber,
        specialties: dealerData.specialties || [],
        description: dealerData.description,
        status: dealerData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deleteDealer = async (id) => {
  try {
    const { error } = await supabase
      .from('dealers_admin_7462')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

// Settings Management
export const getSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings_admin_9384')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching settings:', error.message)
    return { data: [], error: error.message }
  }
}

export const updateSettings = async (settingsData) => {
  try {
    const { data, error } = await supabase
      .from('settings_admin_9384')
      .upsert({
        site_title: settingsData.siteTitle,
        site_description: settingsData.siteDescription,
        contact_email: settingsData.contactEmail,
        support_email: settingsData.supportEmail,
        smtp_host: settingsData.smtpHost,
        smtp_port: settingsData.smtpPort,
        smtp_user: settingsData.smtpUser,
        smtp_pass: settingsData.smtpPass,
        logo_url: settingsData.logoUrl,
        logo_storage_path: settingsData.logoStoragePath,
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Analytics
export const getAnalytics = async () => {
  try {
    // Get user count by role
    const { data: userStats, error: userError } = await supabase
      .from('users_admin_2847')
      .select('role')
    
    if (userError) throw userError
    
    // Get page count by status
    const { data: pageStats, error: pageError } = await supabase
      .from('pages_admin_5839')
      .select('status')
    
    if (pageError) throw pageError
    
    // Get dealer count by status
    const { data: dealerStats, error: dealerError } = await supabase
      .from('dealers_admin_7462')
      .select('status')
    
    if (dealerError) throw dealerError

    // Get message count
    const { data: messageStats, error: messageError } = await supabase
      .from('messages_inbox_4729')
      .select('status, created_at')
    
    if (messageError) throw messageError
    
    // Process stats
    const totalUsers = userStats?.length || 0
    const adminUsers = userStats?.filter(u => u.role === 'admin').length || 0
    const dealerUsers = userStats?.filter(u => u.role === 'dealer').length || 0
    const regularUsers = userStats?.filter(u => u.role === 'user').length || 0
    
    const totalPages = pageStats?.length || 0
    const publishedPages = pageStats?.filter(p => p.status === 'published').length || 0
    const draftPages = pageStats?.filter(p => p.status === 'draft').length || 0
    
    const totalDealers = dealerStats?.length || 0
    const activeDealers = dealerStats?.filter(d => d.status === 'active').length || 0
    const pendingDealers = dealerStats?.filter(d => d.status === 'pending').length || 0

    const totalMessages = messageStats?.length || 0
    const unreadMessages = messageStats?.filter(m => m.status === 'unread').length || 0
    
    return {
      data: {
        users: { total: totalUsers, admin: adminUsers, dealer: dealerUsers, regular: regularUsers },
        pages: { total: totalPages, published: publishedPages, draft: draftPages },
        dealers: { total: totalDealers, active: activeDealers, pending: pendingDealers },
        messages: { total: totalMessages, unread: unreadMessages }
      },
      error: null
    }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// Floorplan Management
export const saveFloorplan = async (floorplanData) => {
  try {
    const { data, error } = await supabase
      .from('floorplans_user_8394')
      .insert([{
        user_id: floorplanData.userId,
        title: floorplanData.title,
        description: floorplanData.description,
        canvas_data: floorplanData.canvasData,
        thumbnail_url: floorplanData.thumbnailUrl,
        is_public: floorplanData.isPublic || false,
        template_name: floorplanData.templateName,
        dimensions: floorplanData.dimensions
      }])
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const getFloorplans = async (userId = null, publicOnly = false) => {
  try {
    let query = supabase
      .from('floorplans_user_8394')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (publicOnly) {
      query = query.eq('is_public', true)
    } else if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

export const updateFloorplan = async (id, floorplanData) => {
  try {
    const { data, error } = await supabase
      .from('floorplans_user_8394')
      .update({
        title: floorplanData.title,
        description: floorplanData.description,
        canvas_data: floorplanData.canvasData,
        thumbnail_url: floorplanData.thumbnailUrl,
        is_public: floorplanData.isPublic,
        template_name: floorplanData.templateName,
        dimensions: floorplanData.dimensions,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return { data: data[0], error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deleteFloorplan = async (id) => {
  try {
    const { error } = await supabase
      .from('floorplans_user_8394')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}