import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Network, ShoppingCart, DollarSign, Calendar, MapPin, Phone, Mail, Award } from 'lucide-react';
import type { MemberProfile, MemberId, Transaction, FamilyTreeNode } from '@/backend';
import { useGetTransactions, useGetFamilyTree } from '@/hooks/useQueries';
import { useMemo } from 'react';
import NetworkTreeVisualization from './NetworkTreeVisualization';

interface MemberDetailModalProps {
  open: boolean;
  onClose: () => void;
  memberId: MemberId;
  memberProfile: MemberProfile;
}

export default function MemberDetailModal({ open, onClose, memberId, memberProfile }: MemberDetailModalProps) {
  const { data: transactions, isLoading: transactionsLoading } = useGetTransactions();
  const { data: familyTree, isLoading: familyTreeLoading } = useGetFamilyTree();

  // Filter transactions for this specific member
  const memberTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(tx => tx.memberId.toString() === memberId.toString());
  }, [transactions, memberId]);

  // Calculate commission totals
  const commissionSummary = useMemo(() => {
    if (!memberTransactions || memberTransactions.length === 0) {
      return {
        totalDirectCommission: 0,
        totalSponsorBonus: 0,
        totalNetworkBonus: 0,
        grandTotal: 0,
      };
    }

    let totalDirectCommission = 0;
    let totalSponsorBonus = 0;
    let totalNetworkBonus = 0;

    memberTransactions.forEach(tx => {
      // Direct commission is at level 0 (not tracked in current structure, so we'll calculate from product price)
      // Network bonuses are tracked by level
      if (Number(tx.level) === 1) {
        // This is a direct downline commission
        totalNetworkBonus += Number(tx.commissionAmount);
      } else if (Number(tx.level) > 1) {
        // This is a deeper level network bonus
        totalNetworkBonus += Number(tx.commissionAmount);
      }
      
      // Sponsor bonus
      totalSponsorBonus += Number(tx.sponsorBonus);
    });

    const grandTotal = totalDirectCommission + totalSponsorBonus + totalNetworkBonus;

    return {
      totalDirectCommission,
      totalSponsorBonus,
      totalNetworkBonus,
      grandTotal,
    };
  }, [memberTransactions]);

  // Count downlines recursively
  const countDownlines = (node: FamilyTreeNode): number => {
    let count = node.children.length;
    node.children.forEach(child => {
      count += countDownlines(child);
    });
    return count;
  };

  const totalDownlines = useMemo(() => {
    if (!familyTree) return 0;
    return countDownlines(familyTree);
  }, [familyTree]);

  const formatCurrency = (amount: number): string => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (timestamp: bigint): string => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            Detail Member: {memberProfile.basic.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-purple-100 dark:bg-purple-900/30">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Network className="w-4 h-4 mr-2" />
              Jaringan
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Penjualan
            </TabsTrigger>
            <TabsTrigger value="commissions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Komisi
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(90vh-200px)] mt-4">
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nama</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{memberProfile.basic.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kontak</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-600" />
                        {memberProfile.basic.contact}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tanggal Bergabung</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        {formatDate(memberProfile.basic.joinDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member ID</p>
                      <code className="text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded font-mono">
                        {memberId.toString()}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {memberProfile.registrationFields.sealed && (
                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      Informasi Lengkap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {memberProfile.registrationFields.fullName && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nama Lengkap</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{memberProfile.registrationFields.fullName}</p>
                        </div>
                      )}
                      {memberProfile.registrationFields.placeOfBirth && memberProfile.registrationFields.dateOfBirth && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tempat & Tanggal Lahir</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {memberProfile.registrationFields.placeOfBirth}, {memberProfile.registrationFields.dateOfBirth}
                          </p>
                        </div>
                      )}
                      {memberProfile.registrationFields.nikKtp && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">NIK KTP</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{memberProfile.registrationFields.nikKtp}</p>
                        </div>
                      )}
                      {memberProfile.registrationFields.whatsappNumber && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nomor WhatsApp</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{memberProfile.registrationFields.whatsappNumber}</p>
                        </div>
                      )}
                      {memberProfile.registrationFields.country && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Negara</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{memberProfile.registrationFields.country}</p>
                        </div>
                      )}
                      {memberProfile.registrationFields.province && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Provinsi</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{memberProfile.registrationFields.province}</p>
                        </div>
                      )}
                      {memberProfile.registrationFields.city && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kota</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{memberProfile.registrationFields.city}</p>
                        </div>
                      )}
                      {memberProfile.registrationFields.sponsorId && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sponsor ID</p>
                          <code className="text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded font-mono">
                            {memberProfile.registrationFields.sponsorId.toString()}
                          </code>
                        </div>
                      )}
                    </div>
                    {memberProfile.registrationFields.completeAddress && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Alamat Lengkap</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          {memberProfile.registrationFields.completeAddress}
                        </p>
                      </div>
                    )}
                    {memberProfile.registrationFields.domicileAddress && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Alamat Domisili</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          {memberProfile.registrationFields.domicileAddress}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Network Tab */}
            <TabsContent value="network" className="space-y-4">
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-purple-600" />
                    Struktur Jaringan
                  </CardTitle>
                  <CardDescription>
                    Total Downline: <Badge variant="secondary" className="ml-2">{totalDownlines} member</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {familyTreeLoading ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Memuat struktur jaringan...</p>
                    </div>
                  ) : familyTree ? (
                    <NetworkTreeVisualization treeData={familyTree} />
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Belum ada data jaringan untuk member ini.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales" className="space-y-4">
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                    Riwayat Transaksi
                  </CardTitle>
                  <CardDescription>
                    Total Transaksi: <Badge variant="secondary" className="ml-2">{memberTransactions.length}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {transactionsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Memuat riwayat transaksi...</p>
                    </div>
                  ) : memberTransactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-purple-50 dark:bg-purple-900/20">
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Harga Produk</TableHead>
                          <TableHead>Komisi</TableHead>
                          <TableHead>Bonus Sponsor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {memberTransactions.map((tx, index) => (
                          <TableRow key={index} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10">
                            <TableCell>{formatDate(tx.date)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-purple-300">
                                Level {Number(tx.level)}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">{formatCurrency(Number(tx.productPrice))}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              {formatCurrency(Number(tx.commissionAmount))}
                            </TableCell>
                            <TableCell className="font-semibold text-yellow-600">
                              {formatCurrency(Number(tx.sponsorBonus))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Belum ada transaksi untuk member ini.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Commissions Tab */}
            <TabsContent value="commissions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-green-200 dark:border-green-800">
                  <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      Komisi Jaringan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {formatCurrency(commissionSummary.totalNetworkBonus)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Dari {memberTransactions.filter(tx => Number(tx.commissionAmount) > 0).length} transaksi
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-yellow-200 dark:border-yellow-800">
                  <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Bonus Sponsor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {formatCurrency(commissionSummary.totalSponsorBonus)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Dari {memberTransactions.filter(tx => Number(tx.sponsorBonus) > 0).length} rekrutmen
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Total Komisi & Bonus
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-neon-purple">
                    <p className="text-sm font-semibold mb-2">Grand Total</p>
                    <p className="text-4xl font-black">
                      {formatCurrency(commissionSummary.grandTotal)}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Komisi Jaringan</span>
                      <span className="font-semibold text-green-600">{formatCurrency(commissionSummary.totalNetworkBonus)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bonus Sponsor</span>
                      <span className="font-semibold text-yellow-600">{formatCurrency(commissionSummary.totalSponsorBonus)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commission History */}
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Riwayat Komisi
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {memberTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {memberTransactions.map((tx, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                              {formatDate(tx.date)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Level {Number(tx.level)} • Produk: {formatCurrency(Number(tx.productPrice))}
                            </p>
                          </div>
                          <div className="text-right">
                            {Number(tx.commissionAmount) > 0 && (
                              <p className="font-semibold text-green-600">
                                +{formatCurrency(Number(tx.commissionAmount))}
                              </p>
                            )}
                            {Number(tx.sponsorBonus) > 0 && (
                              <p className="font-semibold text-yellow-600">
                                +{formatCurrency(Number(tx.sponsorBonus))} (Sponsor)
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Belum ada riwayat komisi.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
