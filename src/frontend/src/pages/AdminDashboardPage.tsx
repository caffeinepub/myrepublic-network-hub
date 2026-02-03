import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsCallerAdmin, useGetLeaderboard, useGetAllProducts, useAddProduct, useGetAllMembers, useGetAllWithdrawals, useApproveWithdrawal, useRejectWithdrawal, useMarkWithdrawalAsPaid } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, TrendingUp, Users, Package, Search, Download, ArrowDownToLine, Check, X, DollarSign, ShieldCheck } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Variant_DownlineCount_SalesVolume, WithdrawalStatus } from '../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MemberDetailModal from '../components/MemberDetailModal';
import type { MemberId, MemberProfile } from '../backend';

export default function AdminDashboardPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: salesLeaderboard } = useGetLeaderboard(Variant_DownlineCount_SalesVolume.SalesVolume);
  const { data: downlineLeaderboard } = useGetLeaderboard(Variant_DownlineCount_SalesVolume.DownlineCount);
  const { data: products } = useGetAllProducts();
  const { data: allMembers, isLoading: membersLoading } = useGetAllMembers();
  const { data: allWithdrawals, isLoading: withdrawalsLoading } = useGetAllWithdrawals();
  const { mutate: addProduct, isPending: addingProduct } = useAddProduct();
  const { mutate: approveWithdrawal } = useApproveWithdrawal();
  const { mutate: rejectWithdrawal } = useRejectWithdrawal();
  const { mutate: markAsPaid } = useMarkWithdrawalAsPaid();

  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCommission, setProductCommission] = useState('');
  const [productExplanation, setProductExplanation] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'joinDate' | 'contact'>('joinDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  // Member detail modal state
  const [selectedMemberId, setSelectedMemberId] = useState<MemberId | null>(null);
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<MemberProfile | null>(null);
  const [memberDetailOpen, setMemberDetailOpen] = useState(false);

  const isAuthenticated = !!identity;

  // Count verified members
  const verifiedMembersCount = useMemo(() => {
    if (!allMembers) return 0;
    return allMembers.filter(([_, profile]) => profile.registrationFields.subscriptionsVerified).length;
  }, [allMembers]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: productName,
      description: productDesc,
      price: BigInt(productPrice),
      commissionRate: BigInt(productCommission),
      explanation: productExplanation,
    }, {
      onSuccess: () => {
        setProductName('');
        setProductDesc('');
        setProductPrice('');
        setProductCommission('');
        setProductExplanation('');
        setDialogOpen(false);
      },
    });
  };

  const handleSort = (field: 'name' | 'joinDate' | 'contact') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleMemberClick = (memberId: MemberId, profile: MemberProfile) => {
    setSelectedMemberId(memberId);
    setSelectedMemberProfile(profile);
    setMemberDetailOpen(true);
  };

  const filteredAndSortedMembers = useMemo(() => {
    if (!allMembers) return [];

    let filtered = allMembers.filter(([memberId, profile]) => {
      const query = searchQuery.toLowerCase();
      return (
        profile.basic.name.toLowerCase().includes(query) ||
        (profile.registrationFields.fullName || '').toLowerCase().includes(query) ||
        profile.basic.contact.toLowerCase().includes(query) ||
        (profile.registrationFields.nikKtp || '').toLowerCase().includes(query) ||
        (profile.registrationFields.whatsappNumber || '').toLowerCase().includes(query) ||
        (profile.registrationFields.bankAccount || '').toLowerCase().includes(query) ||
        (profile.registrationFields.city || '').toLowerCase().includes(query) ||
        (profile.registrationFields.province || '').toLowerCase().includes(query) ||
        (profile.registrationFields.country || '').toLowerCase().includes(query) ||
        (profile.registrationFields.completeAddress || '').toLowerCase().includes(query) ||
        memberId.toString().toLowerCase().includes(query)
      );
    });

    filtered.sort(([, a], [, b]) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.basic.name.localeCompare(b.basic.name);
      } else if (sortField === 'joinDate') {
        comparison = Number(a.basic.joinDate - b.basic.joinDate);
      } else if (sortField === 'contact') {
        comparison = a.basic.contact.localeCompare(b.basic.contact);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allMembers, searchQuery, sortField, sortDirection]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedMembers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedMembers.length / itemsPerPage);

  const handleExport = () => {
    if (!allMembers) return;

    const csvContent = [
      ['Nama', 'Nama Lengkap', 'Tempat Lahir', 'Tanggal Lahir', 'Negara', 'Provinsi', 'Kota', 'Kode Pos', 'Alamat Lengkap', 'Nomor WhatsApp', 'No Rekening', 'Alamat Domisili', 'Kontak', 'Sponsor ID', 'NIK KTP', 'Tanggal Daftar', 'Status Verifikasi'].join(','),
      ...allMembers.map(([memberId, profile]) => [
        profile.basic.name,
        profile.registrationFields.fullName || '-',
        profile.registrationFields.placeOfBirth || '-',
        profile.registrationFields.dateOfBirth || '-',
        profile.registrationFields.country || '-',
        profile.registrationFields.province || '-',
        profile.registrationFields.city || '-',
        (profile.registrationFields.completeAddress || '').match(/\d{5}$/)?.[0] || '-',
        `"${profile.registrationFields.completeAddress || '-'}"`,
        profile.registrationFields.whatsappNumber || '-',
        profile.registrationFields.bankAccount || '-',
        `"${profile.registrationFields.domicileAddress || '-'}"`,
        profile.basic.contact,
        profile.registrationFields.sponsorId?.toString() || '-',
        profile.registrationFields.nikKtp || '-',
        new Date(Number(profile.basic.joinDate) / 1000000).toLocaleDateString('id-ID'),
        profile.registrationFields.subscriptionsVerified ? 'Terverifikasi' : 'Belum Terverifikasi',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `member-list-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const pendingWithdrawals = useMemo(() => {
    if (!allWithdrawals) return [];
    return allWithdrawals.filter(w => w.status === WithdrawalStatus.Pending);
  }, [allWithdrawals]);

  const approvedWithdrawals = useMemo(() => {
    if (!allWithdrawals) return [];
    return allWithdrawals.filter(w => w.status === WithdrawalStatus.Approved);
  }, [allWithdrawals]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>
                Login untuk mengakses dashboard admin
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={login} 
                disabled={loginStatus === 'logging-in'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loginStatus === 'logging-in' ? 'Memproses...' : 'Login'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert className="max-w-md mx-auto border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Anda tidak memiliki akses ke halaman ini. Hanya admin yang dapat mengakses dashboard admin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">Kelola sistem MLM dan pantau performa jaringan</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {allMembers?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {verifiedMembersCount} Terverifikasi
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{products?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              Penarikan Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingWithdrawals.length}</div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Status Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-green-600">Aktif</div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Management */}
      <Card className="mb-8 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-yellow-600" />
            Manajemen Penarikan Saldo
          </CardTitle>
          <CardDescription>Kelola permintaan penarikan saldo dari member</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawalsLoading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data penarikan...</p>
            </div>
          ) : (
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3 bg-yellow-100 dark:bg-yellow-900/30">
                <TabsTrigger value="pending">Menunggu ({pendingWithdrawals.length})</TabsTrigger>
                <TabsTrigger value="approved">Disetujui ({approvedWithdrawals.length})</TabsTrigger>
                <TabsTrigger value="all">Semua ({allWithdrawals?.length || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                {pendingWithdrawals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-yellow-50">
                        <TableHead>Member ID</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>No Rekening</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingWithdrawals.map((withdrawal) => (
                        <TableRow key={Number(withdrawal.requestId)}>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {withdrawal.memberId.toString().slice(0, 10)}...
                            </code>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            Rp {Number(withdrawal.amount).toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>{withdrawal.bankAccount}</TableCell>
                          <TableCell>
                            {new Date(Number(withdrawal.requestDate) / 1000000).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveWithdrawal(withdrawal.requestId)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Setujui
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectWithdrawal(withdrawal.requestId)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Tolak
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-800">
                      Tidak ada permintaan penarikan yang menunggu persetujuan.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-4">
                {approvedWithdrawals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50">
                        <TableHead>Member ID</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>No Rekening</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedWithdrawals.map((withdrawal) => (
                        <TableRow key={Number(withdrawal.requestId)}>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {withdrawal.memberId.toString().slice(0, 10)}...
                            </code>
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            Rp {Number(withdrawal.amount).toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>{withdrawal.bankAccount}</TableCell>
                          <TableCell>
                            {new Date(Number(withdrawal.requestDate) / 1000000).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => markAsPaid(withdrawal.requestId)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <DollarSign className="w-4 h-4 mr-1" />
                              Tandai Dibayar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-800">
                      Tidak ada permintaan penarikan yang disetujui.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                {allWithdrawals && allWithdrawals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead>Member ID</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>No Rekening</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allWithdrawals.map((withdrawal) => {
                        const statusColors = {
                          [WithdrawalStatus.Pending]: 'bg-yellow-100 text-yellow-800',
                          [WithdrawalStatus.Approved]: 'bg-blue-100 text-blue-800',
                          [WithdrawalStatus.Rejected]: 'bg-red-100 text-red-800',
                          [WithdrawalStatus.Paid]: 'bg-green-100 text-green-800',
                        };
                        const statusText = {
                          [WithdrawalStatus.Pending]: 'Menunggu',
                          [WithdrawalStatus.Approved]: 'Disetujui',
                          [WithdrawalStatus.Rejected]: 'Ditolak',
                          [WithdrawalStatus.Paid]: 'Dibayar',
                        };
                        
                        return (
                          <TableRow key={Number(withdrawal.requestId)}>
                            <TableCell>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {withdrawal.memberId.toString().slice(0, 10)}...
                              </code>
                            </TableCell>
                            <TableCell className="font-bold text-green-600">
                              Rp {Number(withdrawal.amount).toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell>{withdrawal.bankAccount}</TableCell>
                            <TableCell>
                              {new Date(Number(withdrawal.requestDate) / 1000000).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[withdrawal.status]}>
                                {statusText[withdrawal.status]}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert className="border-purple-200 bg-purple-50">
                    <AlertDescription className="text-purple-800">
                      Belum ada permintaan penarikan.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Member List Management */}
      <Card className="mb-8 border-purple-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Daftar Member</CardTitle>
              <CardDescription>Kelola dan pantau semua member terdaftar dengan data lengkap termasuk alamat detail, nomor rekening, dan status verifikasi. Klik pada member untuk melihat detail lengkap.</CardDescription>
            </div>
            <Button 
              onClick={handleExport} 
              variant="outline" 
              className="border-purple-200 hover:bg-purple-50"
              disabled={!allMembers || allMembers.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari nama, kontak, NIK KTP, WhatsApp, no rekening, negara, provinsi, kota, alamat, atau Member ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 border-purple-200 focus:border-purple-400"
              />
            </div>
          </div>

          {membersLoading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data member...</p>
            </div>
          ) : allMembers && allMembers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-50">
                      <TableHead 
                        className="cursor-pointer hover:bg-purple-100 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Nama
                          {sortField === 'name' && (
                            <span className="text-purple-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Nama Lengkap</TableHead>
                      <TableHead>Tempat & Tanggal Lahir</TableHead>
                      <TableHead>Negara</TableHead>
                      <TableHead>Provinsi</TableHead>
                      <TableHead>Kota</TableHead>
                      <TableHead>Kode Pos</TableHead>
                      <TableHead>Alamat Lengkap</TableHead>
                      <TableHead>Nomor WhatsApp</TableHead>
                      <TableHead>No Rekening</TableHead>
                      <TableHead>Alamat Domisili</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-purple-100 transition-colors"
                        onClick={() => handleSort('contact')}
                      >
                        <div className="flex items-center gap-1">
                          Kontak
                          {sortField === 'contact' && (
                            <span className="text-purple-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Sponsor ID</TableHead>
                      <TableHead>NIK KTP</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-purple-100 transition-colors"
                        onClick={() => handleSort('joinDate')}
                      >
                        <div className="flex items-center gap-1">
                          Tanggal Daftar
                          {sortField === 'joinDate' && (
                            <span className="text-purple-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verifikasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMembers.map(([memberId, profile]) => {
                      const postalCodeMatch = (profile.registrationFields.completeAddress || '').match(/\d{5}$/);
                      const postalCode = postalCodeMatch ? postalCodeMatch[0] : '-';
                      const isVerified = profile.registrationFields.subscriptionsVerified;
                      
                      return (
                        <TableRow 
                          key={memberId.toString()} 
                          className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                          onClick={() => handleMemberClick(memberId, profile)}
                        >
                          <TableCell className="font-medium">{profile.basic.name}</TableCell>
                          <TableCell>{profile.registrationFields.fullName || '-'}</TableCell>
                          <TableCell>
                            {profile.registrationFields.placeOfBirth && profile.registrationFields.dateOfBirth 
                              ? `${profile.registrationFields.placeOfBirth}, ${profile.registrationFields.dateOfBirth}`
                              : '-'}
                          </TableCell>
                          <TableCell>{profile.registrationFields.country || '-'}</TableCell>
                          <TableCell>{profile.registrationFields.province || '-'}</TableCell>
                          <TableCell>{profile.registrationFields.city || '-'}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-purple-100 text-purple-800">
                              {postalCode}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={profile.registrationFields.completeAddress || '-'}>
                            {profile.registrationFields.completeAddress || '-'}
                          </TableCell>
                          <TableCell>{profile.registrationFields.whatsappNumber || '-'}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-yellow-100 text-yellow-800">
                              {profile.registrationFields.bankAccount || '-'}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={profile.registrationFields.domicileAddress || '-'}>
                            {profile.registrationFields.domicileAddress || '-'}
                          </TableCell>
                          <TableCell>{profile.basic.contact}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {profile.registrationFields.sponsorId?.toString().slice(0, 10) || '-'}...
                            </code>
                          </TableCell>
                          <TableCell>{profile.registrationFields.nikKtp || '-'}</TableCell>
                          <TableCell>
                            {new Date(Number(profile.basic.joinDate) / 1000000).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Aktif
                            </span>
                          </TableCell>
                          <TableCell>
                            {isVerified ? (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Terverifikasi
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-yellow-300 text-yellow-800">
                                Belum Terverifikasi
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedMembers.length)} dari {filteredAndSortedMembers.length} member
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-purple-200"
                    >
                      Sebelumnya
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? "bg-purple-600 hover:bg-purple-700" : "border-purple-200"}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-purple-200"
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Alert className="border-purple-200 bg-purple-50">
              <AlertDescription className="text-purple-800">
                Belum ada member terdaftar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Products Management */}
      <Card className="mb-8 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manajemen Produk</CardTitle>
              <CardDescription>Kelola produk MyRepublic Internet</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Produk Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Nama Produk</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Paket Internet 100 Mbps"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productDesc">Deskripsi</Label>
                    <Textarea
                      id="productDesc"
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      placeholder="Deskripsi produk..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productPrice">Harga (Rp)</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="500000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCommission">Rate Komisi (%)</Label>
                    <Input
                      id="productCommission"
                      type="number"
                      value={productCommission}
                      onChange={(e) => setProductCommission(e.target.value)}
                      placeholder="10"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="productExplanation">Penjelasan Komisi</Label>
                    <Textarea
                      id="productExplanation"
                      value={productExplanation}
                      onChange={(e) => setProductExplanation(e.target.value)}
                      placeholder="Member mendapatkan komisi berdasarkan paket yang dibeli. Bonus dikreditkan setelah pembeli berhasil menyelesaikan pembelian atau instalasi."
                      required
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={addingProduct}>
                    {addingProduct ? 'Menambahkan...' : 'Tambah Produk'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={Number(product.id)} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    {product.explanation && (
                      <p className="text-xs text-gray-500 mt-1 italic">{product.explanation}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-500">Komisi: {Number(product.commissionRate)}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert className="border-purple-200 bg-purple-50">
              <AlertDescription className="text-purple-800">
                Belum ada produk. Tambahkan produk untuk memulai.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle>Top Sales Volume</CardTitle>
            <CardDescription>Member dengan volume penjualan tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            {salesLeaderboard && salesLeaderboard.length > 0 ? (
              <div className="space-y-2">
                {salesLeaderboard.slice(0, 5).map(([principal, volume], index) => (
                  <div key={principal.toString()} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <code className="text-xs">{principal.toString().slice(0, 10)}...</code>
                    </div>
                    <p className="font-semibold text-purple-600">Rp {Number(volume).toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Belum ada data</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle>Top Downline Count</CardTitle>
            <CardDescription>Member dengan downline terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            {downlineLeaderboard && downlineLeaderboard.length > 0 ? (
              <div className="space-y-2">
                {downlineLeaderboard.slice(0, 5).map(([principal, count], index) => (
                  <div key={principal.toString()} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <code className="text-xs">{principal.toString().slice(0, 10)}...</code>
                    </div>
                    <p className="font-semibold text-purple-600">{Number(count)} member</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Belum ada data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Member Detail Modal */}
      {selectedMemberId && selectedMemberProfile && (
        <MemberDetailModal
          open={memberDetailOpen}
          onClose={() => {
            setMemberDetailOpen(false);
            setSelectedMemberId(null);
            setSelectedMemberProfile(null);
          }}
          memberId={selectedMemberId}
          memberProfile={selectedMemberProfile}
        />
      )}
    </div>
  );
}
