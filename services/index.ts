import axiosInstance from "@/api/axiosInstance";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthPayload {
  accessToken: string;
  user: {
    _id: string;
    userName: string;
    userEmail: string;
    role: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  // Add more fields as needed
}

export interface UploadProgressEvent {
  loaded: number;
  total?: number;
}

export async function registerService(
  formData: Record<string, any>
): Promise<ApiResponse<AuthPayload>> {
  const { data } = await axiosInstance.post<ApiResponse<AuthPayload>>(
    "/auth/register",
    {
      ...formData,
      role: "user",
    }
  );
  return data;
}

export async function loginService(
  formData: Record<string, any>
): Promise<ApiResponse<AuthPayload>> {
  const { data } = await axiosInstance.post<ApiResponse<AuthPayload>>(
    "/auth/login",
    formData
  );
  return data;
}

export async function checkAuthService(): Promise<ApiResponse<AuthPayload>> {
  const { data } = await axiosInstance.get<ApiResponse<AuthPayload>>(
    "/auth/check-auth"
  );
  return data;
}

export async function requestOtpService(
  userEmail: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    "/auth/request-otp",
    { userEmail }
  );
  return data;
}

export async function verifyOtpService(
  userEmail: string,
  code: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    "/auth/verify-otp",
    { userEmail, code }
  );
  return data;
}

export async function requestPasswordResetService(
  userEmail: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    "/auth/request-password-reset",
    { userEmail }
  );
  return data;
}

export async function resetPasswordService(
  userEmail: string,
  token: string,
  newPassword: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    "/auth/reset-password",
    { userEmail, token, newPassword }
  );
  return data;
}

export async function mediaUploadService(
  formData: FormData,
  onProgressCallback: (progress: number) => void
): Promise<any> {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (e: UploadProgressEvent) => {
      const percentCompleted = e.total
        ? Math.round((e.loaded * 100) / e.total)
        : 0;
      onProgressCallback(percentCompleted);
    },
  });
  return data;
}

export async function mediaDeleteService(id: string): Promise<any> {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);
  return data;
}

export async function mediaBulkUploadService(
  formData: FormData,
  onProgressCallback: (progress: number) => void
): Promise<any> {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (e: UploadProgressEvent) => {
      const percentCompleted = e.total
        ? Math.round((e.loaded * 100) / e.total)
        : 0;
      onProgressCallback(percentCompleted);
    },
  });
  return data;
}

export async function fetchInstructorCourseListService(): Promise<
  ApiResponse<Course[]>
> {
  const { data } = await axiosInstance.get<ApiResponse<Course[]>>(
    `/instructor/course/get`
  );
  return data;
}

export async function addNewCourseService(
  formData: Record<string, any>
): Promise<ApiResponse<Course>> {
  const { data } = await axiosInstance.post<ApiResponse<Course>>(
    `/instructor/course/add`,
    formData
  );
  return data;
}

export async function fetchInstructorCourseDetailsService(
  id: string
): Promise<ApiResponse<Course>> {
  const { data } = await axiosInstance.get<ApiResponse<Course>>(
    `/instructor/course/get/details/${id}`
  );
  return data;
}

export async function updateCourseByIdService(
  id: string,
  formData: Record<string, any>
): Promise<ApiResponse<Course>> {
  const { data } = await axiosInstance.put<ApiResponse<Course>>(
    `/instructor/course/update/${id}`,
    formData
  );
  return data;
}

export async function fetchStudentViewCourseListService(
  query: string
): Promise<ApiResponse<Course[]>> {
  const { data } = await axiosInstance.get<ApiResponse<Course[]>>(
    `/student/course/get?${query}`
  );
  return data;
}

export async function fetchStudentViewCourseDetailsService(
  courseId: string
): Promise<ApiResponse<Course>> {
  const { data } = await axiosInstance.get<ApiResponse<Course>>(
    `/student/course/get/details/${courseId}`
  );
  return data;
}

export async function checkCoursePurchaseInfoService(
  courseId: string,
  studentId: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.get<ApiResponse<any>>(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );
  return data;
}

export async function createPaymentService(
  formData: Record<string, any>
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    `/student/order/create`,
    formData
  );
  return data;
}

export async function verifyAndFinalizePaymentService(
  reference: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    `/student/order/verify`,
    {
      reference,
    }
  );
  return data;
}

export async function fetchStudentBoughtCoursesService(
  studentId: string
): Promise<ApiResponse<Course[]>> {
  const { data } = await axiosInstance.get<ApiResponse<Course[]>>(
    `/student/courses-bought/get/${studentId}`
  );
  return data;
}

export async function getCurrentCourseProgressService(
  userId: string,
  courseId: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.get<ApiResponse<any>>(
    `/student/course-progress/get/${userId}/${courseId}`
  );
  return data;
}

export async function markLectureAsViewedService(
  userId: string,
  courseId: string,
  lectureId: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );
  return data;
}

export async function resetCourseProgressService(
  userId: string,
  courseId: string
): Promise<ApiResponse<any>> {
  const { data } = await axiosInstance.post<ApiResponse<any>>(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );
  return data;
}
