import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV;

export default {
  title: "Template",
  description: "Website Description",
  schemaType: "LocalBusiness",
  url: env === "production"
    ? "PROD URL"
    : env === "development"
      ? "https://whitesmoke-ant-912302.hostingersite.com"
      : "http://localhost:8080",
  logo: "",
  image: "SEO Preview Image Card (1200 x 675 pixels)",
  phone: "+44 000 000 000",
  email: "info@example.com",
  social: {
    instagram: "https://instagram.com/example",
    facebook: "https://facebook.com/example",
    tiktok: ""
  }
};