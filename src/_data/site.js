export default {
  title: "Template",
  description: "Website Description",
  schemaType: "LocalBusiness",
  url: process.env.CF_PAGES_BRANCH === 'main'
    ? "PROD URL"
    : process.env.CF_PAGES_URL || "http://localhost:8080",
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