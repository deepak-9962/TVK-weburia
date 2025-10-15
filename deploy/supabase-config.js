// Supabase Configuration for TVK Political Party App

const SUPABASE_LIBRARY_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/dist/umd/supabase.min.js';

// Cached state
let supabaseClient;
let envConfig;
let envConfigPromise;

async function loadEnvConfig() {
    if (envConfig) {
        return envConfig;
    }

    if (envConfigPromise) {
        return envConfigPromise;
    }

    envConfigPromise = new Promise(async (resolve, reject) => {
        try {
            if (window.__TVK_ENV__) {
                envConfig = window.__TVK_ENV__;
                resolve(envConfig);
                return;
            }

            // Try to load from local env.local.json first (for local development)
            try {
                const response = await fetch('env.local.json', { cache: 'no-store' });
                if (response.ok) {
                    envConfig = await response.json();
                    window.__TVK_ENV__ = envConfig;
                    resolve(envConfig);
                    return;
                }
            } catch (localError) {
                console.log('env.local.json not found, trying API endpoint...');
            }

            // If local file not found, try Vercel API endpoint (for production)
            try {
                const apiResponse = await fetch('/api/config', { cache: 'no-store' });
                if (apiResponse.ok) {
                    const apiConfig = await apiResponse.json();
                    envConfig = {
                        SUPABASE_URL: apiConfig.supabaseUrl,
                        SUPABASE_ANON_KEY: apiConfig.supabaseAnonKey
                    };
                    window.__TVK_ENV__ = envConfig;
                    resolve(envConfig);
                    return;
                }
            } catch (apiError) {
                console.warn('API config endpoint failed:', apiError);
            }

            // Fallback: Use embedded credentials (for local development without server)
            console.warn('Using embedded fallback credentials');
            envConfig = {
                SUPABASE_URL: 'https://cbcuhojwffwppocnoxel.supabase.co',
                SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY3NDYsImV4cCI6MjA3NDU2Mjc0Nn0.yYdiAY297k7dA2uUYnIlePy8xE0k8veUu_LoVae_QvI'
            };
            window.__TVK_ENV__ = envConfig;
            resolve(envConfig);

        } catch (error) {
            envConfigPromise = undefined;
            reject(error);
        }
    });

    return envConfigPromise;
}

async function getSupabaseCredentials() {
    const config = await loadEnvConfig();

    const url = config.SUPABASE_URL;
    const anonKey = config.SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error('Supabase credentials are missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.');
    }

    return { url, anonKey };
}

// Initialize Supabase when the script loads
async function initializeSupabase() {
    try {
        // Load Supabase library from CDN
        if (!window.supabase) {
            await loadSupabaseLibrary();
        }

        if (supabaseClient) {
            return supabaseClient;
        }

        const { url, anonKey } = await getSupabaseCredentials();

        supabaseClient = window.supabase.createClient(url, anonKey);
        window.supabaseClient = supabaseClient;

        console.log('Supabase initialized successfully');
        return supabaseClient;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        throw error;
    }
}

// Load Supabase library from CDN
function loadSupabaseLibrary() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = SUPABASE_LIBRARY_URL;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Supabase library'));
        document.head.appendChild(script);
    });
}

// Database service functions

class TVKDatabase {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    // BLA Members Operations
    async createBLAMember(memberData) {
        try {
            const { data, error } = await this.supabase
                .from('bla_members')
                .insert([memberData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating BLA member:', error);
            return { success: false, error: error.message };
        }
    }

    async getBLAMembers(limit = 100) {
        try {
            const { data, error } = await this.supabase
                .from('bla_members')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching BLA members:', error);
            return { success: false, error: error.message };
        }
    }

    async updateBLAMember(membershipNumber, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('bla_members')
                .update(updateData)
                .eq('membership_number', membershipNumber)
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating BLA member:', error);
            return { success: false, error: error.message };
        }
    }

    // Complaints Operations
    async createComplaint(complaintData) {
        try {
            const { data, error } = await this.supabase
                .from('complaints')
                .insert([complaintData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating complaint:', error);
            return { success: false, error: error.message };
        }
    }

    async getComplaints(limit = 100) {
        try {
            const { data, error } = await this.supabase
                .from('complaints')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching complaints:', error);
            return { success: false, error: error.message };
        }
    }

    async updateComplaintStatus(complaintId, status) {
        try {
            const { data, error } = await this.supabase
                .from('complaints')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', complaintId)
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating complaint status:', error);
            return { success: false, error: error.message };
        }
    }

    // Activities Operations
    async createActivity(activityData) {
        try {
            const { data, error } = await this.supabase
                .from('activities')
                .insert([activityData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating activity:', error);
            return { success: false, error: error.message };
        }
    }

    async getActivities(limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('activities')
                .select('*')
                .order('activity_date', { ascending: true })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching activities:', error);
            return { success: false, error: error.message };
        }
    }

    // Office Tasks Operations
    async createOfficeTask(taskData) {
        try {
            const { data, error } = await this.supabase
                .from('office_tasks')
                .insert([taskData])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating office task:', error);
            return { success: false, error: error.message };
        }
    }

    async getOfficeTasks(limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('office_tasks')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching office tasks:', error);
            return { success: false, error: error.message };
        }
    }

    async updateTaskProgress(taskId, progress, status = null) {
        try {
            const updateData = { progress, updated_at: new Date().toISOString() };
            if (status) updateData.status = status;

            const { data, error } = await this.supabase
                .from('office_tasks')
                .update(updateData)
                .eq('id', taskId)
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating task progress:', error);
            return { success: false, error: error.message };
        }
    }

    // File Upload Operations
    async uploadFile(bucket, filePath, file) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { success: false, error: error.message };
        }
    }

    async getFileUrl(bucket, filePath) {
        try {
            const { data } = this.supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return { success: true, url: data.publicUrl };
        } catch (error) {
            console.error('Error getting file URL:', error);
            return { success: false, error: error.message };
        }
    }

    // Statistics Operations
    async getStatistics() {
        try {
            const [membersResult, complaintsResult, activitiesResult, tasksResult] = await Promise.all([
                this.supabase.from('bla_members').select('*', { count: 'exact', head: true }),
                this.supabase.from('complaints').select('*', { count: 'exact', head: true }),
                this.supabase.from('activities').select('*', { count: 'exact', head: true }),
                this.supabase.from('office_tasks').select('*', { count: 'exact', head: true })
            ]);

            const pendingComplaints = await this.supabase
                .from('complaints')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            return {
                success: true,
                data: {
                    totalMembers: membersResult.count || 0,
                    totalComplaints: complaintsResult.count || 0,
                    pendingComplaints: pendingComplaints.count || 0,
                    totalActivities: activitiesResult.count || 0,
                    totalTasks: tasksResult.count || 0
                }
            };
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return { success: false, error: error.message };
        }
    }
}

// Global database instance
let tvkDB;

// Initialize database connection
async function initializeDatabase() {
    try {
        const client = await initializeSupabase();
        tvkDB = new TVKDatabase(client);
        return tvkDB;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}

// Alias for getting Supabase client (for compatibility)
async function getSupabaseClient() {
    return await initializeSupabase();
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.TVKDatabase = TVKDatabase;
    window.initializeDatabase = initializeDatabase;
    window.getSupabaseCredentials = getSupabaseCredentials;
    window.getSupabaseClient = getSupabaseClient;
    window.initializeSupabase = initializeSupabase;
    window.tvkDB = null; // Will be set after initialization
}