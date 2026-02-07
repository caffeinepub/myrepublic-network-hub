import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { 
  MemberProfile, 
  Transaction, 
  FamilyTreeNode, 
  Product, 
  Purchase, 
  Achievement,
  Withdrawal,
  WithdrawalStatus,
  PreWhatsAppContactForm,
  FormSubmissionStatus,
  ContactFormSubmission,
  UserRole
} from '@/backend';
import { Principal } from '@icp-sdk/core/principal';

export function useRegisterMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; contact: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerMember(
        data.name,
        data.contact,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sponsorId: Principal | null;
      nikKtp: string | null;
      fullName: string | null;
      placeOfBirth: string | null;
      dateOfBirth: string | null;
      completeAddress: string | null;
      province: string | null;
      city: string | null;
      country: string | null;
      whatsappNumber: string | null;
      domicileAddress: string | null;
      sameAsKtp: boolean | null;
      bankAccount: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(
        data.sponsorId,
        data.nikKtp,
        data.fullName,
        data.placeOfBirth,
        data.dateOfBirth,
        data.completeAddress,
        data.province,
        data.city,
        data.country,
        data.whatsappNumber,
        data.domicileAddress,
        data.sameAsKtp,
        data.bankAccount
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isProfileComplete'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<MemberProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsProfileComplete() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isProfileComplete'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isProfileComplete();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetCurrentUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor,
  });
}

export function useGetMemberProfile(memberId: Principal) {
  const { actor } = useActor();

  return useQuery<MemberProfile>({
    queryKey: ['memberProfile', memberId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMemberProfile(memberId);
    },
    enabled: !!actor,
  });
}

export function useGetOwnMemberProfile() {
  const { actor } = useActor();

  return useQuery<MemberProfile>({
    queryKey: ['ownMemberProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOwnMemberProfile();
    },
    enabled: !!actor,
  });
}

export function useGetTransactions(memberId?: Principal) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  // Use provided memberId or fall back to current user's identity
  const targetMemberId = memberId || identity?.getPrincipal();

  return useQuery<Transaction[]>({
    queryKey: ['transactions', targetMemberId?.toString()],
    queryFn: async () => {
      if (!actor || !targetMemberId) throw new Error('Actor or member ID not available');
      return actor.getTransactions(targetMemberId);
    },
    enabled: !!actor && !!targetMemberId,
  });
}

export function useGetFamilyTree(memberId?: Principal) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  // Use provided memberId or fall back to current user's identity
  const targetMemberId = memberId || identity?.getPrincipal();

  return useQuery<FamilyTreeNode>({
    queryKey: ['familyTree', targetMemberId?.toString()],
    queryFn: async () => {
      if (!actor || !targetMemberId) throw new Error('Actor or member ID not available');
      return actor.getFamilyTree(targetMemberId);
    },
    enabled: !!actor && !!targetMemberId,
  });
}

export function useGetAllProducts() {
  const { actor } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllProducts();
    },
    enabled: !!actor,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetProduct(productId: bigint) {
  const { actor } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProcessPurchaseWithCommissions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { buyerName: string; contact: string; address: string; productId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.processPurchaseWithCommissions(data.buyerName, data.contact, data.address, data.productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['ownMemberProfile'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptionVerificationStatus'] });
    },
  });
}

export function useGetAllPurchases() {
  const { actor } = useActor();

  return useQuery<Purchase[]>({
    queryKey: ['purchases'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPurchases();
    },
    enabled: !!actor,
  });
}

export function useGetAchievements(memberId: Principal) {
  const { actor } = useActor();

  return useQuery<Achievement[]>({
    queryKey: ['achievements', memberId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAchievements(memberId);
    },
    enabled: !!actor,
  });
}

export function useGetAllMembers() {
  const { actor } = useActor();

  return useQuery<[Principal, MemberProfile][]>({
    queryKey: ['allMembers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllMembers();
    },
    enabled: !!actor,
  });
}

export function useSubmitPreWhatsAppContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: PreWhatsAppContactForm): Promise<FormSubmissionStatus> => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPreWhatsAppContactForm(form);
    },
    onSuccess: () => {
      // Invalidate subscription verification status after form submission
      queryClient.invalidateQueries({ queryKey: ['subscriptionVerificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['ownMemberProfile'] });
    },
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestWithdrawal(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawalSummary'] });
    },
  });
}

export function useGetMemberWithdrawals(memberId?: Principal) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  // Use provided memberId or fall back to current user's identity
  const targetMemberId = memberId || identity?.getPrincipal();

  return useQuery<Withdrawal[]>({
    queryKey: ['withdrawals', targetMemberId?.toString()],
    queryFn: async () => {
      if (!actor || !targetMemberId) throw new Error('Actor or member ID not available');
      return actor.getMemberWithdrawals(targetMemberId);
    },
    enabled: !!actor && !!targetMemberId,
  });
}

export function useGetAllWithdrawals() {
  const { actor } = useActor();

  return useQuery<Withdrawal[]>({
    queryKey: ['allWithdrawals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllWithdrawals();
    },
    enabled: !!actor,
  });
}

export function useGetPendingWithdrawals() {
  const { actor } = useActor();

  return useQuery<Withdrawal[]>({
    queryKey: ['pendingWithdrawals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPendingWithdrawals();
    },
    enabled: !!actor,
  });
}

export function useApproveWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withdrawalId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWithdrawal(withdrawalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['allWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
    },
  });
}

export function useRejectWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withdrawalId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectWithdrawal(withdrawalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['allWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
    },
  });
}

export function useMarkWithdrawalAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withdrawalId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markWithdrawalAsPaid(withdrawalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['allWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
    },
  });
}

export function useGetMemberWithdrawalSummary(memberId?: Principal) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  // Use provided memberId or fall back to current user's identity
  const targetMemberId = memberId || identity?.getPrincipal();

  return useQuery<{
    availableBalance: bigint;
    totalWithdrawn: bigint;
    pendingWithdrawals: bigint;
    approvedWithdrawals: bigint;
    rejectedWithdrawals: bigint;
  }>({
    queryKey: ['withdrawalSummary', targetMemberId?.toString()],
    queryFn: async () => {
      if (!actor || !targetMemberId) throw new Error('Actor or member ID not available');
      return actor.getMemberWithdrawalSummary(targetMemberId);
    },
    enabled: !!actor && !!targetMemberId,
  });
}

export function useGetLeaderboard(leaderboardType: any) {
  const { actor } = useActor();

  return useQuery<Array<[Principal, bigint]>>({
    queryKey: ['leaderboard', leaderboardType],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLeaderboard(leaderboardType);
    },
    enabled: !!actor,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: bigint;
      commissionRate: bigint;
      explanation: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(
        data.name,
        data.description,
        data.price,
        data.commissionRate,
        data.explanation
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useGetSubscriptionVerificationStatus(memberId?: Principal) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  // Use provided memberId or fall back to current user's identity
  const targetMemberId = memberId || identity?.getPrincipal();

  return useQuery<boolean>({
    queryKey: ['subscriptionVerificationStatus', targetMemberId?.toString()],
    queryFn: async () => {
      if (!actor || !targetMemberId) return false;
      return actor.getSubscriptionVerificationStatus(targetMemberId);
    },
    enabled: !!actor && !!targetMemberId,
  });
}

export function useHasCompletedSubscription(memberId?: Principal) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  // Use provided memberId or fall back to current user's identity
  const targetMemberId = memberId || identity?.getPrincipal();

  return useQuery<boolean>({
    queryKey: ['hasCompletedSubscription', targetMemberId?.toString()],
    queryFn: async () => {
      if (!actor || !targetMemberId) return false;
      return actor.hasCompletedSubscription(targetMemberId);
    },
    enabled: !!actor && !!targetMemberId,
  });
}

export function useBootstrapDefaultProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.bootstrapDefaultInternetPackagesIfEmpty();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
