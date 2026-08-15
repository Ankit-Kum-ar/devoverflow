export const themes = [
  { value: "light", label: "Light", icon: "/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/icons/moon.svg" },
  { value: "system", label: "System", icon: "/icons/computer.svg" },
];
export const sidebarLinks = [
  {
    imageURL: "/icons/home.svg",
    label: "Home",
    route: "/",
  },
  {
    imageURL: "/icons/users.svg",
    label: "Community",
    route: "/community",
  },
  {
    imageURL: "/icons/star.svg",
    label: "Collections",
    route: "/collections",
  },
  {
    imageURL: "/icons/suitcase.svg",
    label: "Find Jobs",
    route: "/jobs",
  },
  {
    imageURL: "/icons/tag.svg",
    label: "Tags",
    route: "/tags",
  },
  {
    imageURL: "/icons/user.svg",
    label: "Profile",
    route: "/profile",
  },
  {
    imageURL: "/icons/question.svg",
    label: "Ask a Question",
    route: "/ask-question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
