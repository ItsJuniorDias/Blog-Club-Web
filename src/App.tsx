import { useState } from "react";
import background from "./assets/background.png";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string("* Name is required.").min(1),
  email: z.string("* Invalid email.").email(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function App() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("DATA FORM", data);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
        <div className="max-w-6xl w-full bg-white shadow-lg rounded-2xl flex overflow-hidden">
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to the <span className="text-blue-600">Blog Club</span>
            </h1>

            <p className="text-gray-600 mb-6">
              Sign up to receive exclusive content and updates.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full p-3 bg-[#f1f1f1] rounded-2xl"
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
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full p-3 bg-[#f1f1f1] rounded-2xl"
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
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full p-3 bg-[#f1f1f1] rounded-2xl"
                    placeholder="Enter a message"
                  />
                )}
              />

              <button
                type="submit"
                className="w-full bg-[#376AED] text-white px-4 py-3 rounded-2xl"
                onClick={() => handleSubmit(onSubmit)}
              >
                Send
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
    </>
  );
}
