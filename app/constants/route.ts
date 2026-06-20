const ROUTES = {
    HOME : "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    TAG: (id: string) => `/tags/${id}`,
    ASK_QUESTIONS: "/ask-question",
    QUESTIONS: (id: string) => `/questions/${id}`,
    PROFILE: (id: string) => `/profile/${id}`,
    COLLECTION: "/collections",
    COMMUNITY: "/community",
    TAGS: "/tags",
}

export default ROUTES;