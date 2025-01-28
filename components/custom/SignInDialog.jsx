import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { userDetailContext } from "@/app/Context/UserDetailContext";
import axios from "axios";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";

function SignInDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(userDetailContext);
  const CreateUser = useMutation(api.Users.CreateUser);

  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } },
        );
        await CreateUser({
          name: userInfo?.data?.name,
          email: userInfo?.data?.email,
          picture: userInfo?.data?.picture,
          uid: uuid4(),
        });
          localStorage.setItem('user', JSON.stringify(userInfo?.data));
        // }
        setUserDetail(userInfo?.data);
        closeDialog(); // Corrected from closeDialog(false)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      alert("Google login failed. Please try again.");
    },
  });

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center gap-3">
                <h2 className="font-bold text-center text-2xl text-white">
                  {Lookup.SIGNIN_HEADING}
                </h2>
                <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
                <Button
                  onClick={googleLogin}
                  className="bg-blue-500 text-center text-white hover:bg-blue-400 mt-3 gap-3"
                >
                  Sign In With Google
                </Button>
                <p className="text-large">{Lookup.SIGNIN_AGREEMENT_TEXT}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SignInDialog;
