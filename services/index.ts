import axiosInstance from "@/api/axiosInstance";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthPayload {
  accessToken: string;
  user: UserAccount;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  // Add more fields as needed
}

export interface UserAccount {
  _id: string;
  userName: string;
  userEmail: string;
  role: "user" | "instructor" | "admin";
  profileImage?: string;
  preferences?: AccountPreferences;
}

export interface AdminOrder {
  _id: string;
  userName: string;
  userEmail: string;
  courseTitle: string;
  coursePricing: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentReference: string;
  orderDate: string;
}

export interface AdminDashboardData {
  period: { days: number; from: string; to: string };
  totals: {
    users: number;
    students: number;
    instructors: number;
    administrators: number;
    courses: number;
    publishedCourses: number;
    draftCourses: number;
    lessons: number;
    revenue: number;
    paidOrders: number;
    pendingOrders: number;
    activeLearners: number;
    completedCourses: number;
    completionRate: number;
  };
  trend: {
    date: string;
    revenue: number;
    enrollments: number;
  }[];
  topCourses: {
    courseId: string;
    title: string;
    revenue: number;
    enrollments: number;
  }[];
  recentOrders: AdminOrder[];
}

export interface AccountPreferences {
  theme: "system" | "light" | "dark";
  emailNotifications: boolean;
  announcements: boolean;
  roleActivity: boolean;
  secondaryRoleActivity: boolean;
  profileVisible: boolean;
}

export type AccountSettingsUpdate = Partial<AccountPreferences> & {
  userName?: string;
  userEmail?: string;
  profileImage?: string;
  currentPassword?: string;
  newPassword?: string;
};

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

export async function getAccountSettingsService(): Promise<
  ApiResponse<{ user: UserAccount }>
> {
  const { data } = await axiosInstance.get<
    ApiResponse<{ user: UserAccount }>
  >("/auth/settings");
  return data;
}

export async function updateAccountSettingsService(
  settings: AccountSettingsUpdate
): Promise<ApiResponse<{ user: UserAccount }>> {
  const { data } = await axiosInstance.patch<
    ApiResponse<{ user: UserAccount }>
  >("/auth/settings", settings);
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

export async function fetchAdminUsersService(
  role?: UserAccount["role"]
): Promise<ApiResponse<UserAccount[]>> {
  const { data } = await axiosInstance.get<ApiResponse<UserAccount[]>>(
    `/admin/users${role ? `?role=${role}` : ""}`
  );
  return data;
}

export async function updateUserRoleService(
  userId: string,
  role: UserAccount["role"]
): Promise<ApiResponse<UserAccount>> {
  const { data } = await axiosInstance.patch<ApiResponse<UserAccount>>(
    `/admin/users/${userId}/role`,
    { role }
  );
  return data;
}

export async function fetchAdminDashboardService(
  days = 90
): Promise<ApiResponse<AdminDashboardData>> {
  const { data } = await axiosInstance.get<ApiResponse<AdminDashboardData>>(
    `/admin/dashboard?days=${days}`
  );
  return data;
}

export async function fetchAdminOrdersService(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<
  ApiResponse<{
    orders: AdminOrder[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>
> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  const { data } = await axiosInstance.get(`/admin/orders?${query}`);
  return data;
}

export async function updateAdminCoursePublicationService(
  courseId: string,
  published: boolean
): Promise<ApiResponse<Course>> {
  const { data } = await axiosInstance.patch<ApiResponse<Course>>(
    `/admin/courses/${courseId}/publication`,
    { published }
  );
  return data;
}
