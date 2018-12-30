export type Speaker = {
    name: string;
    company?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    medium?: string;
    linkedin?: string;
    blog?: string;
    portraitUrl: string;
    featured: boolean;
    bio: string;
};

export type SpeakerEditorState = {
    name: string,
    company: string,
    featured: boolean,
    file: {
        metadata?: File,
        contents?: ArrayBuffer,
        preview: string
    },
    twitter?: string,
    github?: string,
    facebook?: string,
    medium?: string,
    linkedin?: string,
    blog?: string,
    errors: string[]
};