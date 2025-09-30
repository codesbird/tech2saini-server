import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import {
  insertContactMessageSchema,
  insertSkillSchema,
  insertServiceSchema,
  insertProjectSchema,
  insertExperienceSchema,
  insertBlogPostSchema,
  insertNewsletterSubscriberSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Initialize database with sample data
  // initializeData();

  // Email configuration endpoint
  app.get("/api/email-config", (req, res) => {
    res.json({
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID,
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
    });
  });

  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertContactMessageSchema.parse(req.body);

      // Create contact message
      const message = await storage.createContactMessage(validatedData);

      // In a real application, you would send an email here
      // For now, we'll just log the message and return success
      console.log("New contact message received:", message);

      res.json({
        success: true,
        message: "Message sent successfully!",
        id: message.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      } else {
        console.error("Error processing contact form:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    }
  });

  // Get all contact messages (for admin purposes)
  app.get("/api/contact-messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages"
      });
    }
  });

  // Delete a contact message (for admin purposes)
  app.delete("/api/contact-messages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteContactMessage(id);
      if (!deleted) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      res.json({ success: true, message: "Contact message deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact message:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // -------------------------------------------------------------------------------------------------------------------------------------------------------


  // Skills API
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, updates);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json(skill);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSkill(id);
      if (!deleted) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Services API
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", requireAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, updates);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/services/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteService(id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, updates);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Experiences API
  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });

  app.post("/api/experiences", requireAuth, async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      res.status(201).json(experience);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/experiences/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertExperienceSchema.partial().parse(req.body);
      const experience = await storage.updateExperience(id, updates);
      if (!experience) {
        return res.status(404).json({ error: "Experience not found" });
      }
      res.json(experience);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/experiences/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteExperience(id);
      if (!deleted) {
        return res.status(404).json({ error: "Experience not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Blog posts API
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const publishedOnly = req.query.published !== "false";
      const posts = await storage.getBlogPosts(publishedOnly);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      // Generate slug from title if not provided
      if (!validatedData.slug) {
        validatedData.slug = validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, updates);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/blog-posts/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Newsletter subscription endpoints
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);

      // Check if already subscribed
      const isSubscribed = await storage.isEmailSubscribed(validatedData.email);
      if (isSubscribed) {
        return res.status(400).json({
          success: false,
          message: "Email is already subscribed to the newsletter"
        });
      }

      const subscriber = await storage.createNewsletterSubscriber(validatedData);

      res.json({
        success: true,
        message: "Successfully subscribed to newsletter!",
        id: subscriber.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid email address",
          errors: error.errors
        });
      } else {
        console.error("Error subscribing to newsletter:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }

      const unsubscribed = await storage.unsubscribeNewsletter(email);

      if (unsubscribed) {
        res.json({
          success: true,
          message: "Successfully unsubscribed from newsletter"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Email not found or already unsubscribed"
        });
      }
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin endpoint to get newsletter subscribers
  app.get("/api/newsletter/subscribers", requireAuth, async (req, res) => {
    try {
      const subscribers = await storage.getNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch subscribers"
      });
    }
  });

  // Admin endpoint to delete newsletter subscriber
  app.delete("/api/newsletter/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteNewsletterSubscriber(id);

      if (deleted) {
        res.json({ success: true, message: "Subscriber deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Subscriber not found" });
      }
    } catch (error) {
      console.error("Error deleting newsletter subscriber:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Admin endpoint to update newsletter subscriber status
  app.put("/api/newsletter/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updated = await storage.unsubscribeNewsletter({id,isActive});

      if (updated) {
        res.json({ success: true, message: "Subscriber status updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Subscriber not found" });
      }
    } catch (error) {
      console.error("Error updating newsletter subscriber:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
