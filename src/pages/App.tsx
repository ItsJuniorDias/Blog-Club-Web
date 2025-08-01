import { useEffect, useState } from "react";

import background from "../assets/background.png";
import custom_tech from "../assets/custom_tech.png";

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
      <div className="min-h-screen bg-gradient-to-br bg-[#F8F8F8] flex items-center justify-center">
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-2xl flex overflow-hidden">
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
                className="w-full bg-[#376AED] text-white px-4 py-3 rounded-2xl"
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

      <div className="w-full h-[732px] bg-[#F8F8F8] flex">
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={custom_tech}
            alt="tech"
            className="w-[410px] h-[500 px] object-contain hidden md:block"
          />
        </div>

        <div className=" flex items-center pr-[120px] justify-center  w-1/2">
          <div className="w-[637px] h-auto bg-white shadow-lg rounded-4xl p-8 hidden md:block ">
            <h5 className="text-3xl font-medium text-[#376AED]">
              About the Blog Club
            </h5>

            <h1 className="text-[16px] leading-7  font-medium mt-5 text-gray-700">
              Blog Club is a mobile app developed with React Native and Expo SDK
              53, designed to connect readers, writers, and content enthusiasts
              in one place. With a modern and intuitive interface, the app
              allows users to discover new blogs, follow favorite authors, and
              participate in discussions through comments and direct messages.
              Our goal is to make the reading experience more interactive and
              social. Therefore, we've integrated features such as real-time
              notifications, a favorites system, and a community area for
              members to exchange ideas. All of this with the performance and
              flexibility provided by React Native technology. Whether you're a
              content creator or someone looking for a good read, Blog Club is
              the ideal space to explore, share, and connect.
            </h1>
          </div>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} error={error} />
    </>
  );
}
