erDiagram

    USER {
        string _id
        string name
        string username
        string email
        string bio
        string image
        string location
        string portfolio
        number reputation
    }

    ACCOUNT {
        string _id
        ObjectId userId
        string name
        string image
        string password
        string provider
        string providerAccountId
    }

    INTERACTION {
        string _id
        ObjectId user
        string action
        ObjectId target
        string actionType
    }

    QUESTION {
        string _id
        string title
        string content
        array tags
        number views
        number answers
        number upvotes
        number downvotes
        ObjectId author
    }

    ANSWER {
        string _id
        ObjectId author
        ObjectId question
        string content
        number upvotes
        number downvotes
    }

    VOTE {
        string _id
        ObjectId author
        ObjectId id
        string type
        string voteType
    }

    TAG {
        string _id
        string name
        number questions
    }

    TAGQUESTION {
        string _id
        ObjectId question
        ObjectId tagId
    }

    COLLECTION {
        string _id
        ObjectId author
        ObjectId question
    }

    %% Relationships

    USER ||--o{ ACCOUNT : has
    USER ||--o{ QUESTION : asks
    USER ||--o{ ANSWER : writes
    USER ||--o{ VOTE : gives
    USER ||--o{ COLLECTION : saves
    USER ||--o{ INTERACTION : performs

    QUESTION ||--o{ ANSWER : has
    QUESTION ||--o{ VOTE : receives
    QUESTION ||--o{ COLLECTION : stored_in
    QUESTION ||--o{ TAGQUESTION : tagged_with
    QUESTION ||--o{ INTERACTION : target

    ANSWER ||--o{ VOTE : receives
    ANSWER ||--o{ INTERACTION : target

    TAG ||--o{ TAGQUESTION : maps

    INTERACTION }o--|| USER : belongs_to