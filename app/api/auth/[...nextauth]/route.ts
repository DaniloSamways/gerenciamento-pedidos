import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Declare the types for session and token to add custom properties
declare module "next-auth" {
  interface Session {
    id: string;
    email: string;
  }
  interface JWT {
    id: string;
    email: string;
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // // GERAR NOVA SENHA
          // const password = "debora123";
          // const salt = await bcrypt.genSalt(10);
          // const hashedPassword = await bcrypt.hash(password, salt);
          // console.log(hashedPassword);

          // Aqui você encontra o usuário pelo email
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });

          // Verifique a senha (assumindo que você tem a senha hashada no banco de dados)
          if (
            user &&
            bcrypt.compareSync(credentials?.password || "", user.password)
          ) {
            return { id: user.id, email: user.email }; // Retorna o usuário com id e email
          }

          // Se não encontrar o usuário ou a senha estiver incorreta, retorna null
          return null;
        } catch (error) {
          console.log(error);
          return null; // Em caso de erro, retornamos null explicitamente
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // O caminho da sua página personalizada de login
  },
  session: {
    strategy: "jwt", // Definindo JWT para estratégia de sessão
  },
  callbacks: {
    async jwt({ token, user }) {
      // Armazenando o id e o email no token JWT, se o usuário for autenticado
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionando o id e o email ao objeto de sessão
      if (token) {
        session.id = token.id as string;
        session.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Sua chave secreta do NextAuth
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
