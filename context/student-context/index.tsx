"use client";

import { createContext, useState } from "react";

import { ReactNode } from "react";

type StudentContextType = {
  studentViewCoursesList: any[];
  setStudentViewCoursesList: React.Dispatch<React.SetStateAction<any[]>>;
  loadingState: boolean;
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  studentViewCourseDetails: any;
  currentCourseDetailsId: any;
  setCurrentCourseDetailsId: any;
  studentBoughtCoursesList: any;
  setStudentBoughtCoursesList: any;
  studentCurrentCourseProgress: any;
  setStudentCurrentCourseProgress: any;
  setStudentViewCourseDetails: React.Dispatch<React.SetStateAction<any>>;
  // The rest of the context values are defined in the provider below
};

export const StudentContext = createContext<StudentContextType | null>(null);

type StudentProviderProps = {
  children: ReactNode;
};

export default function StudentProvider({ children }: StudentProviderProps) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState<any[]>(
    []
  );
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState<any>(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
