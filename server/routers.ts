import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { performWebSearch, requiresWebSearch } from "./web-search";
import { nanoid } from "nanoid";
import * as db from "./db";
import { stadtInfoRouter } from "./routers/stadtInfo";

export const appRouter = router({
  system: systemRouter,
  stadtInfo: stadtInfoRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  news: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        if (input.category) {
          return db.getNewsByCategory(input.category, input.limit);
        }
        return db.getAllNews(input.limit);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.getNewsById(input.id);
      }),
  }),

  events: router({
    list: publicProcedure
      .input(z.object({
        upcoming: z.boolean().default(true),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        if (input.upcoming) {
          return db.getUpcomingEvents(input.limit);
        }
        return db.getAllEvents(input.limit);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.getEventById(input.id);
      }),
  }),

  departments: router({
    list: publicProcedure.query(async () => {
      return db.getAllDepartments();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.getDepartmentById(input.id);
      }),
  }),

  issueReports: router({
    list: protectedProcedure
      .input(z.object({
        myReports: z.boolean().default(false),
        limit: z.number().default(100),
      }))
      .query(async ({ input, ctx }) => {
        if (input.myReports) {
          return db.getIssueReportsByUser(ctx.user.id);
        }
        if (ctx.user.role === 'admin') {
          return db.getAllIssueReports(input.limit);
        }
        return db.getIssueReportsByUser(ctx.user.id);
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.getIssueReportById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        category: z.string(),
        description: z.string(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        address: z.string().optional(),
        photoUrl: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = nanoid();
        const ticketNumber = `M-${Date.now()}-${id.slice(0, 6).toUpperCase()}`;
        
        await db.createIssueReport({
          id,
          userId: ctx.user.id,
          ticketNumber,
          ...input,
        });
        
        return { id, ticketNumber };
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(["eingegangen", "in_bearbeitung", "erledigt"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error("Nur Administratoren können den Status ändern");
        }
        await db.updateIssueReportStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  waste: router({
    schedule: publicProcedure
      .input(z.object({
        district: z.string().optional(),
        street: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const fromDate = new Date();
        if (input.street) {
          return db.getWasteScheduleByStreet(input.street, fromDate);
        }
        if (input.district) {
          return db.getWasteScheduleByDistrict(input.district, fromDate);
        }
        return [];
      }),
    
    upcoming: publicProcedure.query(async () => {
      const fromDate = new Date();
      const toDate = new Date();
      toDate.setDate(toDate.getDate() + 7);
      return db.getUpcomingWasteCollections(fromDate, toDate);
    }),
    
    toggleNotifications: protectedProcedure
      .input(z.object({ enabled: z.boolean() }))
      .mutation(async ({ input, ctx }) => {
        await db.updateUserWasteNotifications(ctx.user.id, input.enabled);
        return { success: true };
      }),
  }),

  alerts: router({
    active: publicProcedure.query(async () => {
      return db.getActiveAlerts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.getAlertById(input.id);
      }),
  }),

  pois: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
      }))
      .query(async ({ input }) => {
        if (input.category) {
          return db.getPoisByCategory(input.category);
        }
        return db.getAllPois();
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.getPoiById(input.id);
      }),
  }),

  institutions: router({
    list: publicProcedure
      .input(z.object({
        type: z.string().optional(),
      }))
      .query(async ({ input }) => {
        if (input.type) {
          return db.getInstitutionsByType(input.type);
        }
        return db.getAllInstitutions();
      }),
  }),

  council: router({
    meetings: publicProcedure
      .input(z.object({
        upcoming: z.boolean().default(true),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        if (input.upcoming) {
          return db.getUpcomingCouncilMeetings(input.limit);
        }
        return db.getAllCouncilMeetings(input.limit);
      }),
  }),

  mayor: router({
    info: publicProcedure.query(async () => {
      return db.getMayorInfo();
    }),
  }),

  chat: router({
    send: publicProcedure
      .input(z.object({
        message: z.string(),
        sessionId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const { isLocalQuery, searchLocalContext, formatContextForPrompt, createLocalSystemPrompt, createGlobalSystemPrompt, generateDeepLinks } = await import('./chat-service');
          
          // Prüfe, ob es eine lokale oder globale Frage ist
          const isLocal = isLocalQuery(input.message);
          
          let systemPrompt: string;
          
          if (isLocal) {
            // Lokale Frage: Durchsuche Datenbank
            const localContext = await searchLocalContext(input.message);
            const formattedContext = formatContextForPrompt(localContext);
            systemPrompt = createLocalSystemPrompt(formattedContext);
          } else {
            // Globale Frage: Nutze volles GPT-Wissen ohne Datenbank
            systemPrompt = createGlobalSystemPrompt();
          }
          
          // Generiere Deep-Links
          const deepLinks = generateDeepLinks(input.message);

          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.message },
            ],
          });

          const messageContent = response.choices[0]?.message?.content;
          let assistantMessage = typeof messageContent === 'string' ? messageContent : "Entschuldigung, ich konnte keine Antwort generieren.";
          
          // Füge Deep-Links hinzu
          if (deepLinks) {
            assistantMessage += deepLinks;
          }

          // Log the chat
          await db.createChatLog({
            id: nanoid(),
            userId: ctx.user?.id,
            sessionId: input.sessionId,
            message: input.message,
            response: assistantMessage,
            intent: "general",
            isLocal: isLocal,
            tokens: response.usage?.total_tokens,
          });

          return {
            response: assistantMessage,
            sessionId: input.sessionId,
          };
        } catch (error) {
          console.error("Chat error:", error);
          throw new Error("Fehler beim Verarbeiten der Anfrage");
        }
      }),
    
    history: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return db.getChatLogsBySession(input.sessionId, input.limit);
      }),
  }),

  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserPreferences(ctx.user.id);
    }),
    
    update: protectedProcedure
      .input(z.object({
        favoriteCategories: z.string().optional(),
        wasteDistrict: z.string().optional(),
        wasteStreet: z.string().optional(),
        notificationSettings: z.string().optional(),
        savedPois: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.upsertUserPreferences({
          id: `pref-${ctx.user.id}`,
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  weather: router({
    current: publicProcedure.query(async () => {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return null;
      }
      
      try {
        const lat = 51.8667;
        const lon = 9.1833;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Weather API error:', error);
        return null;
      }
    }),

    forecast: publicProcedure.query(async () => {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        return null;
      }
      
      try {
        const lat = 51.8667;
        const lon = 9.1833;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Weather forecast API error:', error);
        return null;
      }
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().optional(),
        subject: z.string(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createContactMessage({
          id,
          name: input.name,
          email: input.email,
          subject: input.subject,
          message: input.message,
          status: 'neu',
        });
        return { success: true, id };
      }),

    list: protectedProcedure
      .input(z.object({
        status: z.enum(['neu', 'in_bearbeitung', 'erledigt']).optional(),
        limit: z.number().default(50),
      }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        if (input.status) {
          return db.getContactMessagesByStatus(input.status, input.limit);
        }
        return db.getAllContactMessages(input.limit);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(['neu', 'in_bearbeitung', 'erledigt']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await db.updateContactMessageStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  pushNotifications: router({
    active: publicProcedure.query(async () => {
      return db.getActivePushNotifications();
    }),

    all: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      return db.getAllPushNotifications();
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        message: z.string(),
        type: z.enum(["info", "warning", "danger", "event"]),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        expiresAt: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return db.createPushNotification({
          id: nanoid(),
          title: input.title,
          message: input.message,
          type: input.type,
          priority: input.priority,
          isActive: true,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
          createdBy: ctx.user.id,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        message: z.string().optional(),
        type: z.enum(["info", "warning", "danger", "event"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        isActive: z.boolean().optional(),
        expiresAt: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { id, ...updates } = input;
        return db.updatePushNotification(id, {
          ...updates,
          expiresAt: updates.expiresAt ? new Date(updates.expiresAt) : undefined,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return db.deletePushNotification(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;

