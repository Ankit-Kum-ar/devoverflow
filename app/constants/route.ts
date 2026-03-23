const ROUTES = {
    HOME : "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    TAGS: (id: string) => `/tags/${id}`,
    ASK_QUESTIONS: "/ask-question",
}

export default ROUTES;