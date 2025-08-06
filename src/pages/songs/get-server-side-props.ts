import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await fetch("http://localhost:3000/api/songs");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        digested: data,
      },
    };
  } catch (err) {
    console.error("Failed to fetch items:", err);
  }

  return {
    props: {
      digested: [],
    },
  };
};
