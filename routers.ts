import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
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

  paises: router({
    list: publicProcedure.query(async () => {
      return await db.getAllPaises();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPaisById(input.id);
      }),
    create: publicProcedure
      .input(
        z.object({
          nome: z.string().min(1, "Nome é obrigatório"),
          continente: z.string().min(1, "Continente é obrigatório"),
          populacao: z.number().min(0, "População deve ser positiva"),
          idioma: z.string().min(1, "Idioma é obrigatório"),
          bandeira: z.string().optional(),
          moeda: z.string().optional(),
          capital: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createPais(input);
        return { success: true };
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().min(1).optional(),
          continente: z.string().min(1).optional(),
          populacao: z.number().min(0).optional(),
          idioma: z.string().min(1).optional(),
          bandeira: z.string().optional(),
          moeda: z.string().optional(),
          capital: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updatePais(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deletePais(input.id);
      }),
  }),

  cidades: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCidades();
    }),
    getByPais: publicProcedure
      .input(z.object({ idPais: z.number() }))
      .query(async ({ input }) => {
        return await db.getCidadesByPais(input.idPais);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCidadeById(input.id);
      }),
    create: publicProcedure
      .input(
        z.object({
          nome: z.string().min(1, "Nome é obrigatório"),
          populacao: z.number().min(0, "População deve ser positiva"),
          idPais: z.number(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createCidade(input);
        return { success: true };
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          nome: z.string().min(1).optional(),
          populacao: z.number().min(0).optional(),
          idPais: z.number().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCidade(id, data);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteCidade(input.id);
      }),
  }),

  apis: router({
    // REST Countries API - buscar dados complementares de um país
    getCountryData: publicProcedure
      .input(z.object({ countryName: z.string() }))
      .query(async ({ input }) => {
        try {
          const response = await fetch(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(input.countryName)}?fullText=false`
          );
          if (!response.ok) {
            return null;
          }
          const data = await response.json();
          if (data && data.length > 0) {
            const country = data[0];
            return {
              name: country.name?.common || "",
              officialName: country.name?.official || "",
              flag: country.flags?.png || country.flags?.svg || "",
              capital: country.capital?.[0] || "",
              population: country.population || 0,
              region: country.region || "",
              currencies: country.currencies
                ? Object.keys(country.currencies).join(", ")
                : "",
              languages: country.languages
                ? Object.values(country.languages).join(", ")
                : "",
            };
          }
          return null;
        } catch (error) {
          console.error("Erro ao buscar dados do país:", error);
          return null;
        }
      }),

    // OpenWeatherMap API - buscar dados climáticos de uma cidade
    getWeatherData: publicProcedure
      .input(
        z.object({
          cityName: z.string(),
          countryCode: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          // Usando a API gratuita do OpenWeatherMap (sem necessidade de chave para dados básicos)
          // Nota: Em produção, seria necessário uma API key
          const query = input.countryCode
            ? `${input.cityName},${input.countryCode}`
            : input.cityName;
          
          // Como a API do OpenWeatherMap requer chave, vamos simular dados climáticos
          // Em um ambiente real, seria: 
          // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=pt_br`);
          
          // Simulação de dados climáticos para demonstração
          return {
            city: input.cityName,
            temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
            description: ["Ensolarado", "Nublado", "Chuvoso", "Parcialmente nublado"][
              Math.floor(Math.random() * 4)
            ],
            humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
            windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
            simulated: true,
          };
        } catch (error) {
          console.error("Erro ao buscar dados climáticos:", error);
          return null;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
