import { AssessmentResult, Team, UserInfo } from './types';

const mockUser: UserInfo = {
  firstName: "Ahmed",
  lastName: "Haq",
  email: "ahmed@example.com"
};

export const mockAssessments: AssessmentResult[] = [
  {
    score: 1,
    passed: true,
    responses: [],
    topic: "Machine Learning Fundamentals",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-03-03T10:00:00Z",
    certificateId: "CERT-1733263277166",
    learningOutcome: {
      title: "Machine Learning Fundamentals",
      kiuAllocation: 24,
      cpdPoints: 4,
      summary: "Comprehensive overview of machine learning basics",
      academicLevel: "Undergraduate",
      learningTime: 4
    }
  },
  {
    score: 0.9,
    passed: true,
    responses: [],
    topic: "Deep Learning Applications",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-03-02T15:30:00Z",
    certificateId: "CERT-1733263277167",
    learningOutcome: {
      title: "Deep Learning Applications",
      kiuAllocation: 36,
      cpdPoints: 6,
      summary: "Advanced deep learning concepts and applications",
      academicLevel: "Master's",
      learningTime: 6
    }
  },
  {
    score: 0.95,
    passed: true,
    responses: [],
    topic: "Healthcare Analytics",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-03-01T09:15:00Z",
    certificateId: "CERT-1733263277168",
    learningOutcome: {
      title: "Healthcare Analytics",
      kiuAllocation: 18,
      cpdPoints: 3,
      summary: "Data analytics in healthcare settings",
      academicLevel: "Undergraduate",
      learningTime: 3
    }
  },
  {
    score: 1,
    passed: true,
    responses: [],
    topic: "Medical Imaging AI",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-02-29T14:20:00Z",
    certificateId: "CERT-1733263277169",
    learningOutcome: {
      title: "Medical Imaging AI",
      kiuAllocation: 30,
      cpdPoints: 5,
      summary: "AI applications in medical imaging",
      academicLevel: "Master's",
      learningTime: 5
    }
  },
  {
    score: 0.85,
    passed: true,
    responses: [],
    topic: "Business Intelligence",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-02-28T11:45:00Z",
    certificateId: "CERT-1733263277170",
    learningOutcome: {
      title: "Business Intelligence",
      kiuAllocation: 12,
      cpdPoints: 2,
      summary: "Modern BI tools and practices",
      academicLevel: "Undergraduate",
      learningTime: 2
    }
  },
  {
    score: 0.9,
    passed: true,
    responses: [],
    topic: "Data Visualization",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-02-27T16:00:00Z",
    certificateId: "CERT-1733263277171",
    learningOutcome: {
      title: "Data Visualization",
      kiuAllocation: 18,
      cpdPoints: 3,
      summary: "Advanced data visualization techniques",
      academicLevel: "Undergraduate",
      learningTime: 3
    }
  },
  {
    score: 1,
    passed: true,
    responses: [],
    topic: "Natural Language Processing",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-02-26T13:30:00Z",
    certificateId: "CERT-1733263277172",
    learningOutcome: {
      title: "Natural Language Processing",
      kiuAllocation: 24,
      cpdPoints: 4,
      summary: "Modern NLP techniques and applications",
      academicLevel: "Master's",
      learningTime: 4
    }
  },
  {
    score: 0.95,
    passed: true,
    responses: [],
    topic: "Marketing Analytics",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-02-25T10:15:00Z",
    certificateId: "CERT-1733263277173",
    learningOutcome: {
      title: "Marketing Analytics",
      kiuAllocation: 18,
      cpdPoints: 3,
      summary: "Data-driven marketing strategies",
      academicLevel: "Undergraduate",
      learningTime: 3
    }
  },
  {
    score: 0.85,
    passed: true,
    responses: [],
    topic: "Financial Analysis",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-02-24T14:45:00Z",
    certificateId: "CERT-1733263277174",
    learningOutcome: {
      title: "Financial Analysis",
      kiuAllocation: 24,
      cpdPoints: 4,
      summary: "Advanced financial analysis methods",
      academicLevel: "Master's",
      learningTime: 4
    }
  },
  {
    score: 1,
    passed: true,
    responses: [],
    topic: "Digital Marketing",
    userName: "Ahmed Haq",
    userInfo: mockUser,
    date: "2024-02-23T11:00:00Z",
    certificateId: "CERT-1733263277175",
    learningOutcome: {
      title: "Digital Marketing",
      kiuAllocation: 12,
      cpdPoints: 2,
      summary: "Modern digital marketing practices",
      academicLevel: "Undergraduate",
      learningTime: 2
    }
  }
];

export const mockTeams: Team[] = [
  {
    id: "team_1733261248966",
    name: "Data Science Team",
    createdBy: mockUser,
    members: [
      { email: "member1@example.com", status: "active", joinedAt: "2024-03-01T10:00:00Z" },
      { email: "member2@example.com", status: "active", joinedAt: "2024-03-01T11:00:00Z" },
      { email: "member3@example.com", status: "pending" },
      { email: "member4@example.com", status: "active", joinedAt: "2024-03-02T09:00:00Z" },
      { email: "member5@example.com", status: "pending" }
    ],
    createdAt: "2024-03-01T09:00:00Z"
  },
  {
    id: "team_1733261248967",
    name: "Marketing Analytics",
    createdBy: mockUser,
    members: [
      { email: "member6@example.com", status: "active", joinedAt: "2024-03-02T10:00:00Z" },
      { email: "member7@example.com", status: "pending" },
      { email: "member8@example.com", status: "active", joinedAt: "2024-03-02T11:00:00Z" },
      { email: "member9@example.com", status: "pending" },
      { email: "member10@example.com", status: "active", joinedAt: "2024-03-02T12:00:00Z" }
    ],
    createdAt: "2024-03-02T09:00:00Z"
  }
];