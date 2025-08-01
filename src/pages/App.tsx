import { useEffect, useState } from "react";

import background from "../assets/background.png";
import custom_tech from "../assets/custom_tech.png";
import logo from "../assets/logo.png";
import facebook from "../assets/facebook.png";

import { addDoc, collection, db, doc } from "../../firebaseConfig";

import Modal from "../components/modal/index";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toast, ToastContainer } from "react-toastify";
import { getDoc, getDocs } from "@firebase/firestore";
import SniperCard from "../components/spiner";
import Spinner from "../components/spiner";

const schema = z.object({
  name: z.string("* Name is required.").min(1),
  email: z.string("* Email is required.").email(),
  message: z.string().optional(),
  status: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const API_KEY = "2b2f58d7b2c78894ee8c26626e77f64fa08fd16b";

export default function App() {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState({
    isError: false,
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simula carregamento
    return () => clearTimeout(timer);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
      status: "valid",
    },
  });

  const validadeEmail = async (email: string) => {
    const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(
      email
    )}&api_key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  };

  const onSubmit = async (data: FormData) => {
    const response = await validadeEmail(data.email);

    const docRef = collection(db, "emails");

    const docSnap = await getDocs(docRef);

    const filterEmail = docSnap.docs.find(
      (item) => item.data().email === data.email
    );

    if (!!filterEmail?.data()) {
      setOpen(true);

      return setError((prevState) => ({
        ...prevState,
        isError: true,
        message: "Your email has already been registered",
      }));
    }

    if (response.data.status !== "invalid") {
      await addDoc(collection(db, "emails"), {
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: new Date(),
      });

      setOpen(true);

      setError((prevState) => ({
        ...prevState,
        isError: false,
        message: "",
      }));
    } else {
      setOpen(true);

      setError((prevState) => ({
        ...prevState,
        isError: true,
        message: "something went wrong with your email is invalid",
      }));
    }

    setValue("name", "");
    setValue("email", "");
    setValue("message", "");
  };

  const mutation = useMutation({
    mutationFn: handleSubmit(onSubmit),
    onSuccess: () => {},
  });

  return (
    <>
      <div
        id="topo"
        className="min-h-screen sm:min-h-auto bg-gradient-to-br bg-white flex items-center justify-center"
      >
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-2xl flex overflow-hidden sm:">
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to the <span className="text-blue-600">Blog Club</span>
            </h1>

            <p className="text-gray-600 mb-6">
              Sign up to receive exclusive content and updates.
            </p>

            <form
              onSubmit={(data) => mutation.mutate(data)}
              className="space-y-4"
            >
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    value={value}
                    onChange={(text) => {
                      onChange(text);

                      if (errors.name) {
                        clearErrors("name");
                      }
                    }}
                    className={`w-full p-3 bg-[#f1f1f1] rounded-2xl  ${
                      errors.name &&
                      "border-2 border-red-500 focus:outline-none"
                    } `}
                    placeholder="Enter your name"
                  />
                )}
              />

              {errors.name && (
                <div className="pb">
                  <span className="text-red-500">{errors.name.message}</span>
                </div>
              )}

              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    value={value}
                    onChange={(text) => {
                      onChange(text);

                      if (errors.email) {
                        clearErrors("email");
                      }
                    }}
                    className={`w-full p-3 bg-[#f1f1f1] rounded-2xl ${
                      errors.email &&
                      "border-2 border-red-500 focus:outline-none"
                    } `}
                    placeholder="Enter your email"
                  />
                )}
              />
              {errors.email && (
                <div className="pb">
                  <span className=" text-red-500">{errors.email.message}</span>
                </div>
              )}

              <Controller
                name="message"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <textarea
                    value={value}
                    onChange={(text) => {
                      onChange(text);

                      if (errors.message) {
                        clearErrors("message");
                      }
                    }}
                    className="w-full p-3 bg-[#f1f1f1] rounded-2xl "
                    placeholder="Enter a message"
                  />
                )}
              />

              <button
                type="submit"
                className="w-full bg-[#376AED] hover:bg-[#2c57c2] text-white px-4 py-3 rounded-2xl"
              >
                {mutation.isPending ? <Spinner /> : "Send"}
              </button>
            </form>
          </div>

          <div className="hidden md:block w-1/2">
            <img
              src={background}
              alt="Blog Club"
              className="h-[787px] w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen bg-[#F8F8F8] flex flex-col lg:flex-row items-center justify-center p-4">
        <div className="w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-0">
          <img
            src={custom_tech}
            alt="tech"
            className="w-[300px] sm:w-[350px] md:w-[410px] h-auto object-cover"
          />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-[637px] bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8">
            <h5 className="text-2xl sm:text-3xl font-medium text-[#376AED]">
              About the Blog Club
            </h5>

            <p className="text-base leading-7 font-medium mt-6 text-gray-700">
              Blog Club is a mobile app developed with React Native and Expo SDK
              53, designed to connect readers, writers, and content enthusiasts
              in one place. With a modern and intuitive interface, the app
              allows users to discover new blogs, follow favorite authors, and
              participate in discussions through comments and direct messages.
            </p>

            <p className="text-base leading-7 font-medium mt-6 text-gray-700">
              Our goal is to make the reading experience more interactive and
              social. Therefore, we've integrated features such as real-time
              notifications, a favorites system, and a community area for
              members to exchange ideas. All of this with the performance and
              flexibility provided by React Native technology. Whether you're a
              content creator or someone looking for a good read, Blog Club is
              the ideal space to explore, share, and connect.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 md:px-[140px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full bg-[#262626] p-6 md:p-8 rounded-3xl mt-20">
          <div className="text-white mb-6 md:mb-0 md:mr-4 max-w-xl">
            <h5 className="text-xl md:text-2xl mb-2">
              Want to know more about Blog Club?
            </h5>
            <p className="text-sm md:text-base">
              Fill out the form above or contact us. We'll show you how Blog
              Club can transform your blogging experience!
            </p>
          </div>

          <a
            href="#topo"
            className="w-full sm:w-[162px] h-[50px] sm:h-[60px] bg-[#376AED] hover:bg-[#2c57c2] text-white rounded-2xl flex items-center justify-center self-end md:self-auto"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 md:px-[140px] w-full py-12">
        <img
          src={logo}
          alt="logo"
          className="w-[80px] h-[80px] object-contain mb-6 md:mb-0 hidden md:block"
        />

        <div className="text-center md:text-left">
          <h5 className="mb-4">Connect with us</h5>
          <a href="https://www.facebook.com/profile.php?id=61578929874937#">
            <img
              src={facebook}
              alt="facebook"
              className="w-[40px] h-[40px] object-contain inline-block md:block"
            />
          </a>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} error={error} />
    </>
  );
}
