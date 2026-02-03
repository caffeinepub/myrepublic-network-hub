import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    explanation: string;
    description: string;
    commissionRate: bigint;
    price: bigint;
}
export type Time = bigint;
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export type ContactFormId = bigint;
export interface BasicProfile {
    contact: string;
    joinDate: Time;
    name: string;
}
export interface MemberProfile {
    profileCompletionTimestamp?: Time;
    registrationFields: RegistrationFields;
    profileCompletionStatus: ProfileCompletionStatus;
    basic: BasicProfile;
    profileRole: UserRole;
}
export interface Transaction {
    memberId: MemberId;
    date: Time;
    level: Level;
    sponsorBonus: bigint;
    commissionAmount: CommissionAmount;
    productPrice: bigint;
}
export interface ContactFormSubmission {
    id: ContactFormId;
    customerName: string;
    packagePrice: bigint;
    submittedAt: Time;
    submittedBy: MemberId;
    productId: bigint;
    customerAddress: string;
    phoneNumber: string;
    coordinates: Coordinates;
}
export interface Achievement {
    id: bigint;
    memberId: MemberId;
    achievedAt: Time;
    description: string;
}
export interface IncentiveComponent {
    id: bigint;
    name: string;
    description: string;
    percentage: number;
}
export interface Withdrawal {
    status: WithdrawalStatus;
    memberId: MemberId;
    requestId: WithdrawalId;
    bankAccount: string;
    amount: bigint;
    requestDate: Time;
}
export interface RegistrationFields {
    placeOfBirth?: string;
    country?: string;
    province?: string;
    bankAccount?: string;
    dateOfBirth?: string;
    sameAsKtp?: boolean;
    city?: string;
    completeAddress?: string;
    sponsorId?: MemberId;
    fullName?: string;
    sealed: boolean;
    whatsappNumber?: string;
    subscriptionsVerified: boolean;
    nikKtp?: string;
    domicileAddress?: string;
}
export interface Purchase {
    id: bigint;
    status: PurchaseStatus;
    contact: string;
    purchaseDate: Time;
    productId: bigint;
    address: string;
    buyerName: string;
}
export interface Theme {
    backgroundColor: string;
    primaryColor: string;
    accentColor: string;
    secondaryColor: string;
}
export interface FamilyTreeNode {
    memberId: MemberId;
    registrationFields: RegistrationFields;
    children: Array<FamilyTreeNode>;
    basic: BasicProfile;
}
export type MemberId = Principal;
export type CommissionAmount = bigint;
export type WithdrawalId = bigint;
export type FormSubmissionStatus = {
    __kind__: "Error";
    Error: string;
} | {
    __kind__: "Success";
    Success: ContactFormId;
};
export interface PreWhatsAppContactForm {
    customerName: string;
    productId: bigint;
    customerAddress: string;
    phoneNumber: string;
    coordinates: Coordinates;
}
export type Level = bigint;
export enum ProfileCompletionStatus {
    incomplete = "incomplete",
    complete = "complete"
}
export enum PurchaseStatus {
    Cancelled = "Cancelled",
    Completed = "Completed",
    Pending = "Pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_DownlineCount_SalesVolume {
    DownlineCount = "DownlineCount",
    SalesVolume = "SalesVolume"
}
export enum WithdrawalStatus {
    Paid = "Paid",
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, commissionRate: bigint, explanation: string): Promise<void>;
    approveMembershipRequest(requestId: bigint): Promise<void>;
    approveWithdrawal(withdrawalId: WithdrawalId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPurchase(buyerName: string, contact: string, address: string, productId: bigint): Promise<void>;
    getAchievements(memberId: MemberId): Promise<Array<Achievement>>;
    getAllByStatus(status: WithdrawalStatus): Promise<Array<Withdrawal>>;
    getAllContactFormSubmissions(): Promise<Array<ContactFormSubmission>>;
    getAllMembers(): Promise<Array<[MemberId, MemberProfile]>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllPurchases(): Promise<Array<Purchase>>;
    getAllWithdrawals(): Promise<Array<Withdrawal>>;
    getApprovedWithdrawals(): Promise<Array<Withdrawal>>;
    getCallerUserProfile(): Promise<MemberProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactFormSubmission(submissionId: ContactFormId): Promise<ContactFormSubmission | null>;
    getCurrentUserRole(): Promise<UserRole>;
    getFamilyTree(memberId: MemberId): Promise<FamilyTreeNode>;
    getLeaderboard(leaderboardType: Variant_DownlineCount_SalesVolume): Promise<Array<[Principal, bigint]>>;
    getMemberProfile(memberId: MemberId): Promise<MemberProfile>;
    getMemberWithdrawalSummary(memberId: MemberId): Promise<{
        availableBalance: bigint;
        pendingWithdrawals: bigint;
        totalWithdrawn: bigint;
        rejectedWithdrawals: bigint;
        approvedWithdrawals: bigint;
    }>;
    getMemberWithdrawals(memberId: MemberId): Promise<Array<Withdrawal>>;
    getOwnMemberProfile(): Promise<MemberProfile>;
    getPendingWithdrawals(): Promise<Array<Withdrawal>>;
    getProduct(productId: bigint): Promise<Product | null>;
    getProductPrice(productId: bigint): Promise<bigint | null>;
    getProfessionalIncentiveScheme(): Promise<{
        note: string;
        incentiveComponents: Array<IncentiveComponent>;
    }>;
    getPurchase(purchaseId: bigint): Promise<Purchase | null>;
    getSubscriptionVerificationStatus(memberId: MemberId): Promise<boolean>;
    getThemeSettings(): Promise<Theme>;
    getTransactions(memberId: MemberId): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<MemberProfile | null>;
    getWithdrawal(withdrawalId: WithdrawalId): Promise<Withdrawal | null>;
    hasCompletedSubscription(memberId: MemberId): Promise<boolean>;
    hasUserPermission(): Promise<boolean>;
    initializeDefaultInternetPackages(): Promise<void>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isProfileComplete(): Promise<boolean>;
    markWithdrawalAsPaid(withdrawalId: WithdrawalId): Promise<void>;
    processPurchaseWithCommissions(buyerName: string, contact: string, address: string, productId: bigint): Promise<void>;
    recordAchievement(description: string): Promise<void>;
    recordSales(productId: bigint, quantity: bigint): Promise<void>;
    registerMember(name: string, contact: string, sponsorId: MemberId | null, nikKtp: string | null, fullName: string | null, placeOfBirth: string | null, dateOfBirth: string | null, completeAddress: string | null, province: string | null, city: string | null, country: string | null, whatsappNumber: string | null, domicileAddress: string | null, sameAsKtp: boolean | null, bankAccount: string | null): Promise<void>;
    rejectMembershipRequest(requestId: bigint): Promise<void>;
    rejectWithdrawal(withdrawalId: WithdrawalId): Promise<void>;
    removeMember(memberId: MemberId): Promise<void>;
    requestWithdrawal(amount: bigint): Promise<WithdrawalId>;
    saveCallerUserProfile(sponsorId: MemberId | null, nikKtp: string | null, fullName: string | null, placeOfBirth: string | null, dateOfBirth: string | null, completeAddress: string | null, province: string | null, city: string | null, country: string | null, whatsappNumber: string | null, domicileAddress: string | null, sameAsKtp: boolean | null, bankAccount: string | null): Promise<void>;
    submitContactForm(customerName: string, phoneNumber: string, customerAddress: string, coordinates: Coordinates, productId: bigint): Promise<ContactFormId>;
    submitMembershipRequest(profile: MemberProfile): Promise<void>;
    submitPreWhatsAppContactForm(form: PreWhatsAppContactForm): Promise<FormSubmissionStatus>;
    updatePurchaseStatus(purchaseId: bigint, status: PurchaseStatus): Promise<void>;
    updateSubscriptionVerificationStatus(memberId: MemberId): Promise<void>;
    validateAdmin(): Promise<void>;
}
