import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import LayoutWrapper from "@/components/Wrapper/LayoutWrapper";

export const BlogSection = () => {
  // Blog post data for mapping
  const blogPosts = [
    {
      id: 1,
      title: "How to Create an Effective Study Plan for CSS Exams",
      description:
        "A well-structured study plan is key to cracking the CSS. Learn how to design a personalized schedule, balance optional and compulsory subjects, and avoid common mistakes.",
      image: "/Rectangle 36.png",
    },
    {
      id: 2,
      title: "How to Create an Effective Study Plan for CSS Exams",
      description:
        "A well-structured study plan is key to cracking the CSS. Learn how to design a personalized schedule, balance optional and compulsory subjects, and avoid common mistakes.",
      image: "/Rectangle 37.png",
    },
    {
      id: 3,
      title: "How to Create an Effective Study Plan for CSS Exams",
      description:
        "A well-structured study plan is key to cracking the CSS. Learn how to design a personalized schedule, balance optional and compulsory subjects, and avoid common mistakes.",
      image: "/Rectangle 38.png",
    },
  ];

  return (
    <LayoutWrapper>
    <section className=" mx-auto py-10 sm:py-12 mb-16 sm:mb-[10rem]">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 mb-10 sm:mb-[3rem]">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium text-center sm:text-left">
          Latest News & Blogs
        </h2>
        <Button
          variant="outline"
          className="border-2 border-[#1C6758] text-[#1C6758] rounded-md w-auto"
        >
          View More
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {blogPosts.map((post) => (
          <Card key={post.id} className="border-none shadow-none">
            <CardContent className="p-0 space-y-3 sm:space-y-4">
              <Image
                width={300}
                height={300}
                className="w-full h-48 sm:h-[220px] md:h-[278px] object-cover rounded-lg"
                alt="Blog post thumbnail"
                src={post.image}
              />
              <h3 className="text-lg sm:text-xl md:text-2xl mt-4 h-[54px] md:h-[72px] overflow-hidden">
                {post.title}
              </h3>
              <p className="font-tags text-gray-500 text-sm sm:text-base h-20 md:h-24 overflow-hidden">
                {post.description}
              </p>
              <a
                href="#"
                className="inline-block text-[#1C6758] hover:underline font-medium"
              >
                Read More
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
    </LayoutWrapper>
  );
};
