export interface Lesson { slug: string; title: string; goal: string; section: string; sectionSlug: string; unit: string; }
export const sections: { slug: string; title: string; description: string; units: { title: string; lessons: { slug: string; title: string; goal: string }[] }[] }[];
export const lessons: Lesson[];
export type CourseSidebarItem = { label: string; link: string } | { label: string; collapsed?: boolean; items: CourseSidebarItem[] };
export const englishSidebar: CourseSidebarItem[];
