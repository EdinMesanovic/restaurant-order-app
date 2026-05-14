type AppConfigType = {
  name: string;
  github: {
    title: string;
    url: string;
  };
  author: {
    name: string;
    url: string;
  };
};

export const appConfig: AppConfigType = {
  name: import.meta.env.VITE_APP_NAME ?? "Smash Burger",
  github: {
    title: "Smash Burger - A restaurant order management app",
    url: "https://github.com/EdinMesanovic/theme-template",
  },
  author: {
    name: "Edin Mešanović",
    url: "https://github.com/EdinMesanovic",
  },
};

export const baseUrl = import.meta.env.VITE_BASE_URL ?? "";
