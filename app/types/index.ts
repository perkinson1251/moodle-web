export interface SiteInfo {
  userid: number
  fullname: string
  username: string
  siteurl: string
  functions?: unknown[]
}

export interface Course {
  id: number
  shortname: string
  fullname: string
  idnumber?: string
  visible?: number
}

export interface Assignment {
  id: number
  name: string
  duedate: number
  intro?: string
}

export interface AssignmentsResponse {
  courses: {
    id: number
    fullname: string
    assignments: Assignment[]
  }[]
}

export interface CalendarEvent {
  id: number
  name: string
  description?: string
  timestart: number
  timeduration?: number
  courseid?: number
  eventtype?: string
  modulename?: string
  instance?: number
}

export interface GradeItem {
  id: number
  itemname?: string | null
  itemtype?: string
  itemmodule?: string | null
  iteminstance?: number
  gradeformatted?: string
  grademax?: number
  grademin?: number
}

export interface UserGrade {
  courseid?: number
  userid?: number
  userfullname?: string
  gradeitems: GradeItem[]
}

export interface EnrolledUser {
  id: number
  fullname: string
  email?: string
  roles?: { shortname: string }[]
}

export interface CourseModule {
  id: number
  modname?: string
  name: string
  url?: string | null
  contents?: { type: string; fileurl: string }[] | null
}

export interface CourseSection {
  id: number
  name: string
  modules: CourseModule[]
}

export interface UserDetail {
  id: number
  fullname: string
  email?: string
  department?: string
  institution?: string
  idnumber?: string
  profileimageurl?: string
  profileimageurlsmall?: string
  username?: string
  firstname?: string
  lastname?: string
  firstaccess?: number
  lastaccess?: number
  auth?: string
  suspended?: boolean
  confirmed?: boolean
  lang?: string
  city?: string
  country?: string
  description?: string
  descriptionformat?: number
}

export interface MoodleFile {
  filename?: string
  filepath?: string
  filesize?: number
  fileurl?: string
  timemodified?: number
  mimetype?: string | null
  type?: string
}
