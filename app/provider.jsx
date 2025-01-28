import React, { useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { MessagesContext } from "./Context/MessagesContext";
import { userDetailContext } from "./Context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import AppSideBar from "@/components/custom/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

function Provider({ children }) {
  const [userDetail, setUserDetail] = useState(null);
  const [messages, setMessages] = useState([]);
  const convex = useConvex();
  const router = useRouter();

  // Track if the component has mounted on the client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set isMounted to true after the component mounts
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const IsAuthenticated = async () => {
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push('/');
          return;
        }
        if (userData) {
          const userParsed = JSON.parse(userData);
          setUserDetail(userParsed);

          // Fetch user data from the database (Convex)
          const result = await convex.query(api.Users.GetUser, {
            email: userParsed.email,
          });
          setUserDetail(result);
        }
      };

      IsAuthenticated();
    }
  }, [isMounted, router, convex]); // Dependency on isMounted to avoid running on the server side

  // Only render the component once it's mounted to prevent the "NextRouter was not mounted" error
  if (!isMounted) {
    return null; // or a loading indicator if needed
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTHENTICATION_KEY}>
      <userDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <MessagesContext.Provider value={{ messages, setMessages }}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <SidebarProvider defaultOpen={false}>
              <AppSideBar />
              {children}
            </SidebarProvider>
          </NextThemesProvider>
        </MessagesContext.Provider>
      </userDetailContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
