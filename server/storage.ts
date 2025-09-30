import { createClient } from '@supabase/supabase-js';
import {
  type User,
  type InsertUser,
  type LoginUser,
  type ContactMessage,
  type InsertContactMessage,
  type Skill,
  type InsertSkill,
  type Service,
  type InsertService,
  type Project,
  type InsertProject,
  type Experience,
  type InsertExperience,
  type BlogPost,
  type InsertBlogPost,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: string): Promise<boolean>;

  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;

  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Experiences
  getExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: string): Promise<boolean>;

  // Blog posts
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Newsletter subscribers
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  unsubscribeNewsletter(email: string): Promise<boolean>;
  isEmailSubscribed(email: string): Promise<boolean>;
}
import { supabaseAdmin } from './supabase';
import { Z_DATA_ERROR } from 'node:zlib';

// Supabase storage implementation
export class SupabaseStorage implements IStorage {
  private supabase: any;
  constructor() {
    this.supabase = supabaseAdmin;
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase.from('users').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.supabase.from('users').select('*').eq('email', email).single();

    console.log('getUserByEmail called with email:', email);
    console.log('Supabase response:', data, error);

    if (error || data === null || data === undefined) {
      return undefined
    };

    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await this.supabase.from('users').insert({
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name,
      two_factor_secret: insertUser.twoFactorSecret,
      two_factor_enabled: insertUser.twoFactorEnabled || false
    })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const updateData: any = {};
    if (updates.email) updateData.email = updates.email;
    if (updates.password) updateData.password = updates.password;
    if (updates.name) updateData.name = updates.name;
    if (updates.twoFactorSecret !== undefined) updateData.two_factor_secret = updates.twoFactorSecret;
    if (updates.twoFactorEnabled !== undefined) updateData.two_factor_enabled = updates.twoFactorEnabled;

    // Telegram specific updates
    if (updates.telegramToken) updateData.telegram_token = updates.telegramToken;
    if (updates.telegramChatId) updateData.telegram_chat_id = updates.telegramChatId;
    if (updates.telegramotp) updateData.telegramotp = updates.telegramotp;

    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    console.log('Updating user with ID:', data, error);
    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      twoFactorSecret: data.two_factor_secret,
      twoFactorEnabled: data.two_factor_enabled
    };
  }

  // Contact messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await this.supabase
      .from('contact_messages')
      .insert({
        name: insertMessage.name,
        email: insertMessage.email,
        phone: insertMessage.phone,
        subject: insertMessage.subject,
        message: insertMessage.message
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at)
    };
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await this.supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.created_at)
    }));
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    return !error;
  }


  // Skills
  async getSkills(): Promise<Skill[]> {
    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      isAdditional: item.is_additional,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const { data, error } = await this.supabase
      .from('skills')
      .insert({
        name: skill.name,
        level: skill.level,
        icon: skill.icon,
        color: skill.color,
        is_additional: skill.isAdditional || false,
        order: skill.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      isAdditional: data.is_additional,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const updateData: any = {};
    if (skill.name) updateData.name = skill.name;
    if (skill.level !== undefined) updateData.level = skill.level;
    if (skill.icon) updateData.icon = skill.icon;
    if (skill.color) updateData.color = skill.color;
    if (skill.isAdditional !== undefined) updateData.is_additional = skill.isAdditional;
    if (skill.order !== undefined) updateData.order = skill.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      isAdditional: data.is_additional,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteSkill(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('skills')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Services
  async getServices(): Promise<Service[]> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async createService(service: InsertService): Promise<Service> {
    const { data, error } = await this.supabase
      .from('services')
      .insert({
        title: service.title,
        description: service.description,
        price: service.price,
        features: service.features,
        icon: service.icon,
        order: service.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const updateData: any = {};
    if (service.title) updateData.title = service.title;
    if (service.description) updateData.description = service.description;
    if (service.price) updateData.price = service.price;
    if (service.features) updateData.features = service.features;
    if (service.icon) updateData.icon = service.icon;
    if (service.order !== undefined) updateData.order = service.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteService(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('services')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      gradientFrom: item.gradient_from,
      gradientTo: item.gradient_to,
      demoUrl: item.demo_url,
      githubUrl: item.github_url,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('title', slug)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async createProject(project: InsertProject): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert({
        title: project.title,
        description: project.description,
        content: project.content,
        image: project.image,
        technologies: project.technologies,
        gradient_from: project.gradientFrom,
        gradient_to: project.gradientTo,
        demo_url: project.demoUrl,
        github_url: project.githubUrl,
        featured: project.featured || false,
        order: project.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const updateData: any = {};
    if (project.title) updateData.title = project.title;
    if (project.description) updateData.description = project.description;
    if (project.content) updateData.content = project.content;
    if (project.image) updateData.image = project.image;
    if (project.technologies) updateData.technologies = project.technologies;
    if (project.gradientFrom) updateData.gradient_from = project.gradientFrom;
    if (project.gradientTo) updateData.gradient_to = project.gradientTo;
    if (project.demoUrl) updateData.demo_url = project.demoUrl;
    if (project.githubUrl) updateData.github_url = project.githubUrl;
    if (project.featured !== undefined) updateData.featured = project.featured;
    if (project.order !== undefined) updateData.order = project.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      gradientFrom: data.gradient_from,
      gradientTo: data.gradient_to,
      demoUrl: data.demo_url,
      githubUrl: data.github_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteProject(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    const { data, error } = await this.supabase
      .from('experiences')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const { data, error } = await this.supabase
      .from('experiences')
      .insert({
        period: experience.period,
        title: experience.title,
        company: experience.company,
        description: experience.description,
        gpa: experience.gpa,
        coursework: experience.coursework,
        color: experience.color,
        order: experience.order || 0
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const updateData: any = {};
    if (experience.period) updateData.period = experience.period;
    if (experience.title) updateData.title = experience.title;
    if (experience.company) updateData.company = experience.company;
    if (experience.description) updateData.description = experience.description;
    if (experience.gpa) updateData.gpa = experience.gpa;
    if (experience.coursework) updateData.coursework = experience.coursework;
    if (experience.color) updateData.color = experience.color;
    if (experience.order !== undefined) updateData.order = experience.order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('experiences')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteExperience(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Blog posts
  async getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    let query = this.supabase.from('blog_posts').select('*');

    if (publishedOnly) {
      query = query.eq('published', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      publishedAt: item.published_at ? new Date(item.published_at) : null,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.featuredImage,
        tags: post.tags,
        published: post.published || false,
        author: post.author || null,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData: any = {};
    if (post.title) updateData.title = post.title;
    if (post.slug) updateData.slug = post.slug;
    if (post.excerpt) updateData.excerpt = post.excerpt;
    if (post.content) updateData.content = post.content;
    if (post.featuredImage) updateData.featured_image = post.featuredImage;
    if (post.tags) updateData.tags = post.tags;
    if (post.published !== undefined) updateData.published = post.published;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return {
      ...data,
      publishedAt: data.published_at ? new Date(data.published_at) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Newsletter subscribers
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const { data, error } = await this.supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data.map((item: any) => ({
      ...item,
      isActive: item.is_active,
      subscribedAt: new Date(item.subscribed_at),
      unsubscribedAt: item.unsubscribed_at ? new Date(item.unsubscribed_at) : null
    }));
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const { data, error } = await this.supabase
      .from('newsletter_subscribers')
      .insert({
        email: subscriber.email,
        name: subscriber.name,
        is_active: subscriber.isActive !== undefined ? subscriber.isActive : true
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      isActive: data.is_active,
      subscribedAt: new Date(data.subscribed_at),
      unsubscribedAt: data.unsubscribed_at ? new Date(data.unsubscribed_at) : null
    };
  }

  async unsubscribeNewsletter(data_: Object): Promise<boolean> {
    console.log("Unsubscribing email:", data_);

    const { data, error } = await this.supabase
      .from('newsletter_subscribers')
      .update({
        is_active: data_.isActive,
        unsubscribed_at: data_.isActive ? null : new Date().toISOString()
      })
      .eq('id', data_.id)
      .select();

    return !error && data.length > 0;
  }

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);
    return !error;
  }


  async isEmailSubscribed(email: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    return !error && !!data;
  }

  //send message to telegram
  async sendTelegramMessage(message: string, token: string, chatid: string): Promise<boolean> {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatid,
        text: message
      })
    });

    if (!response.ok) {
      console.error("Failed to send Telegram message:", response.statusText);
      return false;
    }
    return true;
  }


  // set teletegram chatid, token and enable in user table
  async setTelegramConfig(userId: string, token: string, chatId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('users')
      .update({
        telegram_token: token,
        telegram_chat_id: chatId,
        telegram_enabled: true
      })
      .eq('id', userId);
    if (error) {
      console.error("Failed to set Telegram config:", error.message);
      return false;
    }
    return true;
  }



}

// Always use SupabaseStorage for all data operations
export const storage = new SupabaseStorage();