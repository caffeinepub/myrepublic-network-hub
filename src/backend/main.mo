import Principal "mo:core/Principal";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  include MixinStorage();

  type MemberId = Principal;
  type Level = Nat;
  type CommissionAmount = Nat;
  type WithdrawalId = Nat;
  type ContactFormId = Nat;
  type ProfileCompletionStatus = { #complete; #incomplete };

  type Map<K, V> = Map.Map<K, V>;

  public type UserRole = AccessControl.UserRole;

  public type WithdrawalStatus = {
    #Pending;
    #Approved;
    #Rejected;
    #Paid;
  };

  public type BasicProfile = {
    name : Text;
    contact : Text;
    joinDate : Time.Time;
  };

  public type RegistrationFields = {
    sealed : Bool;
    sponsorId : ?MemberId;
    nikKtp : ?Text;
    fullName : ?Text;
    placeOfBirth : ?Text;
    dateOfBirth : ?Text;
    completeAddress : ?Text;
    province : ?Text;
    city : ?Text;
    country : ?Text;
    whatsappNumber : ?Text;
    domicileAddress : ?Text;
    sameAsKtp : ?Bool;
    bankAccount : ?Text;
    subscriptionsVerified : Bool;
  };

  public type IncentiveComponent = {
    id : Nat;
    name : Text;
    percentage : Float;
    description : Text;
  };

  public type MemberProfile = {
    basic : BasicProfile;
    registrationFields : RegistrationFields;
    profileCompletionStatus : ProfileCompletionStatus;
    profileCompletionTimestamp : ?Time.Time;
    profileRole : UserRole;
  };

  public type Withdrawal = {
    requestId : WithdrawalId;
    memberId : MemberId;
    amount : Nat;
    bankAccount : Text;
    status : WithdrawalStatus;
    requestDate : Time.Time;
  };

  public type Transaction = {
    memberId : MemberId;
    commissionAmount : CommissionAmount;
    date : Time.Time;
    level : Level;
    productPrice : Nat;
    sponsorBonus : Nat;
  };

  public type MembershipRequest = {
    id : Nat;
    memberProfile : MemberProfile;
    status : {
      #Pending;
      #Approved;
      #Rejected;
    };
  };

  public type Achievement = {
    id : Nat;
    memberId : MemberId;
    description : Text;
    achievedAt : Time.Time;
  };

  public type FamilyTreeNode = {
    memberId : MemberId;
    basic : BasicProfile;
    registrationFields : RegistrationFields;
    children : [FamilyTreeNode];
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    commissionRate : Nat;
    explanation : Text;
  };

  public type Purchase = {
    id : Nat;
    buyerName : Text;
    contact : Text;
    address : Text;
    productId : Nat;
    status : PurchaseStatus;
    purchaseDate : Time.Time;
  };

  public type PurchaseStatus = {
    #Pending;
    #Completed;
    #Cancelled;
  };

  public type SalesRecord = {
    id : Nat;
    memberId : MemberId;
    productId : Nat;
    quantity : Nat;
    totalAmount : Nat;
    commissionAmount : Nat;
    salesDate : Time.Time;
  };

  public type Theme = {
    primaryColor : Text;
    secondaryColor : Text;
    accentColor : Text;
    backgroundColor : Text;
  };

  public type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type ContactFormSubmission = {
    id : ContactFormId;
    submittedBy : MemberId;
    customerName : Text;
    phoneNumber : Text;
    customerAddress : Text;
    coordinates : Coordinates;
    productId : Nat;
    packagePrice : Nat;
    submittedAt : Time.Time;
  };

  public type PreWhatsAppContactForm = {
    customerName : Text;
    phoneNumber : Text;
    customerAddress : Text;
    coordinates : Coordinates;
    productId : Nat;
  };

  var memberProfiles : Map<MemberId, MemberProfile> = Map.empty();
  var transactions : Map<MemberId, List.List<Transaction>> = Map.empty();
  var withdrawals : Map<WithdrawalId, Withdrawal> = Map.empty();
  var membershipRequests : Map<Nat, MembershipRequest> = Map.empty();
  var salesRecords : Map<Nat, SalesRecord> = Map.empty();
  var products : Map<Nat, Product> = Map.empty();
  var achievements : Map<MemberId, List.List<Achievement>> = Map.empty();
  var purchases : Map<Nat, Purchase> = Map.empty();
  var contactFormSubmissions : Map<ContactFormId, ContactFormSubmission> = Map.empty();

  var currentProductId = 0;
  var currentSalesRecordId = 0;
  var currentRequestId = 0;
  var currentAchievementId = 0;
  var currentPurchaseId = 0;
  var currentWithdrawalId = 0;
  var currentContactFormId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func validateCallerIsUser(caller : Principal) : () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can perform this action");
    };
  };

  func validateCallerIsAdmin(caller : Principal) : () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can perform this action");
    };
  };

  func validateCallerIsRegisteredMember(caller : Principal) : () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can perform this action");
    };
    if (not memberProfiles.containsKey(caller)) {
      Runtime.trap("Unauthorized: Only registered members can perform this action");
    };
  };

  func validateCallerHasCompleteProfile(caller : Principal) : () {
    validateCallerIsRegisteredMember(caller);

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return;
    };

    switch (memberProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Member profile not found");
      };
      case (?profile) {
        switch (profile.profileCompletionStatus) {
          case (#incomplete) {
            Runtime.trap("Unauthorized: Profile completion required. Please complete your profile before accessing this feature.");
          };
          case (#complete) {};
        };
      };
    };
  };

  func validateCallerIsVerifiedMember(caller : Principal) : () {
    validateCallerHasCompleteProfile(caller);

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return;
    };

    switch (memberProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Member profile not found");
      };
      case (?profile) {
        if (not profile.registrationFields.subscriptionsVerified) {
          Runtime.trap("Unauthorized: Anda harus menyelesaikan minimal satu langganan sebelum dapat merekrut anggota lain. Status 'Terverifikasi' diperlukan untuk mengakses fitur perekrutan.");
        };
      };
    };
  };

  public query ({ caller }) func hasCompletedSubscription(memberId : MemberId) : async Bool {
    switch (memberProfiles.get(memberId)) {
      case (null) { false };
      case (?profile) {
        profile.registrationFields.subscriptionsVerified;
      };
    };
  };

  func isMemberProfileComplete(memberId : MemberId) : Bool {
    switch (memberProfiles.get(memberId)) {
      case (null) { false };
      case (?profile) {
        switch (profile.profileCompletionStatus) {
          case (#complete) { true };
          case (#incomplete) { false };
        };
      };
    };
  };

  public query ({ caller }) func validateAdmin() : async () {
    validateCallerIsAdmin(caller);
  };

  public query ({ caller }) func getCurrentUserRole() : async UserRole {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return #admin;
    } else if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #user;
    } else {
      return #guest;
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func hasUserPermission() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #user);
  };

  public query ({ caller }) func isProfileComplete() : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };

    isMemberProfileComplete(caller);
  };

  public shared ({ caller }) func registerMember(
    name : Text,
    contact : Text,
    sponsorId : ?MemberId,
    nikKtp : ?Text,
    fullName : ?Text,
    placeOfBirth : ?Text,
    dateOfBirth : ?Text,
    completeAddress : ?Text,
    province : ?Text,
    city : ?Text,
    country : ?Text,
    whatsappNumber : ?Text,
    domicileAddress : ?Text,
    sameAsKtp : ?Bool,
    bankAccount : ?Text,
  ) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot register");
    };

    if (memberProfiles.containsKey(caller)) {
      Runtime.trap("User is already registered.");
    };

    let role = await getCurrentUserRole();

    switch (role) {
      case (#admin) {
        let basic : BasicProfile = {
          name;
          contact;
          joinDate = Time.now();
        };

        let registrationFields : RegistrationFields = {
          sealed = true;
          sponsorId = null;
          nikKtp = null;
          fullName = null;
          placeOfBirth = null;
          dateOfBirth = null;
          completeAddress = null;
          province = null;
          city = null;
          country = null;
          whatsappNumber = null;
          domicileAddress = null;
          sameAsKtp = null;
          bankAccount = null;
          subscriptionsVerified = true;
        };

        let profile : MemberProfile = {
          basic;
          registrationFields;
          profileCompletionStatus = #complete;
          profileCompletionTimestamp = ?Time.now();
          profileRole = #admin;
        };
        memberProfiles.add(caller, profile);
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
      case (#guest) {
        Runtime.trap(
          "Unauthorized: Please authenticate before registering"
        );
      };
      case (#user) {
        let basic : BasicProfile = {
          name;
          contact;
          joinDate = Time.now();
        };

        let registrationFields : RegistrationFields = {
          sealed = false;
          sponsorId = null;
          nikKtp = null;
          fullName = null;
          placeOfBirth = null;
          dateOfBirth = null;
          completeAddress = null;
          province = null;
          city = null;
          country = null;
          whatsappNumber = null;
          domicileAddress = null;
          sameAsKtp = null;
          bankAccount = null;
          subscriptionsVerified = false;
        };

        let profile : MemberProfile = {
          basic;
          registrationFields;
          profileCompletionStatus = #incomplete;
          profileCompletionTimestamp = null;
          profileRole = #user;
        };
        memberProfiles.add(caller, profile);
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
    };
  };

  func isNIKKTPUnique(nikKtp : Text) : Bool {
    for ((_, profile) in memberProfiles.entries()) {
      switch (profile.registrationFields.nikKtp) {
        case (null) {};
        case (?nik) {
          if (nik == nikKtp) { return false };
        };
      };
    };

    for ((_, request) in membershipRequests.entries()) {
      switch (request.memberProfile.registrationFields.nikKtp) {
        case (null) {};
        case (?nik) {
          if (nik == nikKtp) { return false };
        };
      };
    };
    true;
  };

  public shared ({ caller }) func removeMember(memberId : MemberId) : async () {
    validateCallerIsAdmin(caller);
    memberProfiles.remove(memberId);
  };

  public query ({ caller }) func getMemberProfile(memberId : MemberId) : async MemberProfile {
    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own profile");
    };

    switch (memberProfiles.get(memberId)) {
      case (null) { Runtime.trap("Member not found.") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getOwnMemberProfile() : async MemberProfile {
    validateCallerIsUser(caller);

    switch (memberProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found.") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getTransactions(memberId : MemberId) : async [Transaction] {
    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own transactions");
    };

    switch (transactions.get(memberId)) {
      case (null) { [] };
      case (?txs) { txs.toArray() };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?MemberProfile {
    validateCallerIsUser(caller);
    memberProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?MemberProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own profile");
    };
    memberProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(
    sponsorId : ?MemberId,
    nikKtp : ?Text,
    fullName : ?Text,
    placeOfBirth : ?Text,
    dateOfBirth : ?Text,
    completeAddress : ?Text,
    province : ?Text,
    city : ?Text,
    country : ?Text,
    whatsappNumber : ?Text,
    domicileAddress : ?Text,
    sameAsKtp : ?Bool,
    bankAccount : ?Text,
  ) : async () {
    validateCallerIsUser(caller);

    let currentRole = await getCurrentUserRole();

    switch (memberProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found.") };
      case (?existingProfile) {
        if (currentRole == #admin) {
          let updatedProfile : MemberProfile = {
            basic = existingProfile.basic;
            registrationFields = existingProfile.registrationFields;
            profileCompletionStatus = #complete;
            profileCompletionTimestamp = ?Time.now();
            profileRole = #admin;
          };
          memberProfiles.add(caller, updatedProfile);
        } else {
          let sponsor = switch (sponsorId) {
            case (null) { Runtime.trap("Referral (Sponsor ID) wajib diisi dan harus valid.") };
            case (?id) { id };
          };

          if (sponsor.isAnonymous()) {
            Runtime.trap("Referral (Sponsor ID) wajib diisi dan harus valid.");
          };

          if (not memberProfiles.containsKey(sponsor)) {
            Runtime.trap("Referral (Sponsor ID) wajib diisi dan harus valid.");
          };

          let nik = switch (nikKtp) {
            case (null) { Runtime.trap("NIK KTP wajib diisi dan harus valid.") };
            case (?k) { k };
          };

          if (not isNIKKTPUnique(nik)) {
            Runtime.trap("NIK KTP ini sudah digunakan untuk pendaftaran.");
          };

          let address = switch (completeAddress) {
            case (null) {
              Runtime.trap("Alamat lengkap wajib diisi dan harus valid.");
            };
            case (?addr) { addr };
          };

          let bankAcc = switch (bankAccount) {
            case (null) {
              Runtime.trap("Nomor rekening bank wajib diisi untuk penarikan komisi dan tidak boleh kosong.");
            };
            case (?acc) {
              if (acc == "") {
                Runtime.trap("Nomor rekening bank wajib diisi untuk penarikan komisi dan tidak boleh kosong.");
              };
              acc;
            };
          };

          let updatedFields = {
            sealed = true;
            sponsorId;
            nikKtp;
            fullName;
            placeOfBirth;
            dateOfBirth;
            completeAddress;
            province;
            city;
            country;
            whatsappNumber;
            domicileAddress;
            sameAsKtp;
            bankAccount = ?bankAcc;
            subscriptionsVerified = false;
          };

          let updatedProfile : MemberProfile = {
            basic = existingProfile.basic;
            registrationFields = updatedFields;
            profileCompletionStatus = #complete;
            profileCompletionTimestamp = ?Time.now();
            profileRole = #user;
          };
          memberProfiles.add(caller, updatedProfile);
        };
      };
    };
  };

  public shared ({ caller }) func submitMembershipRequest(profile : MemberProfile) : async () {
    validateCallerIsVerifiedMember(caller);

    switch (profile.registrationFields.sealed) {
      case (false) {
        Runtime.trap("The provided profile must be sealed before submission.");
      };
      case (true) {
        let sponsor = switch (profile.registrationFields.sponsorId) {
          case (null) {
            Runtime.trap(
              "Referral (Sponsor ID) wajib diisi dan harus valid."
            );
          };
          case (?id) { id };
        };

        if (sponsor.isAnonymous()) {
          Runtime.trap(
            "Referral (Sponsor ID) wajib diisi dan harus valid."
          );
        };

        if (not memberProfiles.containsKey(sponsor)) {
          Runtime.trap(
            "Referral (Sponsor ID) wajib diisi dan harus valid."
          );
        };

        switch (profile.registrationFields.nikKtp) {
          case (null) {
            Runtime.trap("NIK KTP wajib diisi dan harus valid.");
          };
          case (?nik) {
            if (not isNIKKTPUnique(nik)) {
              Runtime.trap("NIK KTP ini sudah digunakan untuk pendaftaran.");
            };
          };
        };

        switch (profile.registrationFields.bankAccount) {
          case (null) {
            Runtime.trap("Nomor rekening bank wajib diisi untuk penarikan komisi dan tidak boleh kosong.");
          };
          case (?acc) {
            if (acc == "") {
              Runtime.trap("Nomor rekening bank wajib diisi untuk penarikan komisi dan tidak boleh kosong.");
            };
          };
        };

        let request : MembershipRequest = {
          id = currentRequestId;
          memberProfile = profile;
          status = #Pending;
        };

        membershipRequests.add(currentRequestId, request);
        currentRequestId += 1;
      };
    };
  };

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, commissionRate : Nat, explanation : Text) : async () {
    validateCallerIsAdmin(caller);

    let product : Product = {
      id = currentProductId;
      name;
      description;
      price;
      commissionRate;
      explanation;
    };

    products.add(currentProductId, product);
    currentProductId += 1;
  };

  public query func getProduct(productId : Nat) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    let productsIter = products.values();
    productsIter.toArray();
  };

  public shared ({ caller }) func recordSales(productId : Nat, quantity : Nat) : async () {
    validateCallerHasCompleteProfile(caller);

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found.") };
      case (?product) {
        let commissionAmount = (product.price * product.commissionRate * quantity) / 100;
        let salesRecord : SalesRecord = {
          id = currentSalesRecordId;
          memberId = caller;
          productId;
          quantity;
          totalAmount = product.price * quantity;
          commissionAmount;
          salesDate = Time.now();
        };

        salesRecords.add(currentSalesRecordId, salesRecord);
        currentSalesRecordId += 1;

        updateSubscriptionVerificationStatus(caller);
      };
    };
  };

  public func updateSubscriptionVerificationStatus(memberId : MemberId) : () {
    switch (memberProfiles.get(memberId)) {
      case (null) { Runtime.trap("Member profile not found") };
      case (?profile) {
        let updatedFields = {
          profile.registrationFields with
          subscriptionsVerified = true;
        };
        let updatedProfile = {
          profile with
          registrationFields = updatedFields;
        };
        memberProfiles.add(memberId, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getSubscriptionVerificationStatus(memberId : MemberId) : async Bool {
    switch (memberProfiles.get(memberId)) {
      case (null) { false };
      case (?profile) {
        profile.registrationFields.subscriptionsVerified;
      };
    };
  };

  public shared ({ caller }) func submitContactForm(
    customerName : Text,
    phoneNumber : Text,
    customerAddress : Text,
    coordinates : Coordinates,
    productId : Nat,
  ) : async ContactFormId {
    validateCallerHasCompleteProfile(caller);

    if (customerName == "") {
      Runtime.trap("Nama pelanggan harus diisi.");
    };

    if (phoneNumber == "") {
      Runtime.trap("Nomor HP wajib diisi.");
    };

    if (customerAddress == "") {
      Runtime.trap("Alamat pelanggan harus diisi.");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Produk tidak ditemukan") };
      case (?product) {
        let submission : ContactFormSubmission = {
          id = currentContactFormId;
          submittedBy = caller;
          customerName;
          phoneNumber;
          customerAddress;
          coordinates;
          productId;
          packagePrice = product.price;
          submittedAt = Time.now();
        };

        contactFormSubmissions.add(currentContactFormId, submission);
        let submissionId = currentContactFormId;
        currentContactFormId += 1;
        submissionId;
      };
    };
  };

  public query ({ caller }) func getContactFormSubmission(submissionId : ContactFormId) : async ?ContactFormSubmission {
    switch (contactFormSubmissions.get(submissionId)) {
      case (null) { null };
      case (?submission) {
        if (caller != submission.submittedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own contact form submissions");
        };
        ?submission;
      };
    };
  };

  public query ({ caller }) func getAllContactFormSubmissions() : async [ContactFormSubmission] {
    validateCallerIsAdmin(caller);
    let submissionsIter = contactFormSubmissions.values();
    submissionsIter.toArray();
  };

  public shared ({ caller }) func processPurchaseWithCommissions(buyerName : Text, contact : Text, address : Text, productId : Nat) : async () {
    validateCallerHasCompleteProfile(caller);

    if (buyerName == "") {
      Runtime.trap("Nama pembeli harus diisi. Silakan isi nama pembeli sebelum melanjutkan pembelian.");
    };

    if (contact == "") {
      Runtime.trap("Nomor kontak harus diisi. Silakan isi nomor kontak sebelum melanjutkan pembelian.");
    };

    if (address == "") {
      Runtime.trap("Alamat harus diisi. Silakan isi alamat sebelum melanjutkan pembelian.");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Produk tidak ditemukan") };
      case (?product) {
        let purchase : Purchase = {
          id = currentPurchaseId;
          buyerName;
          contact;
          address;
          productId;
          status = #Pending;
          purchaseDate = Time.now();
        };

        purchases.add(currentPurchaseId, purchase);
        currentPurchaseId += 1;

        await calculateUplineSalesCommissions(caller, product.price);
        applySponsorBonus(caller, product.price);

        updateSubscriptionVerificationStatus(caller);
      };
    };
  };

  func getCommissionRateForLevel(level : Nat) : Nat {
    if (level == 1) { return 1000 };
    if (level == 2) { return 500 };
    if (level == 3) { return 200 };
    if (level == 4) { return 100 };
    if (level == 5) { return 50 };
    return 25;
  };

  func calculateUplineSalesCommissions(memberId : MemberId, productPrice : Nat) : async () {
    var currentMemberId : ?MemberId = ?memberId;
    var level : Level = 1;

    label uplineLoop loop {
      switch (currentMemberId) {
        case (null) { break uplineLoop };
        case (?currentId) {
          switch (memberProfiles.get(currentId)) {
            case (null) { break uplineLoop };
            case (?profile) {
              switch (profile.registrationFields.sponsorId) {
                case (null) { break uplineLoop };
                case (?sponsorId) {
                  if (not memberProfiles.containsKey(sponsorId)) {
                    break uplineLoop;
                  };

                  let commissionRateBasisPoints = getCommissionRateForLevel(level);
                  let commission = (productPrice * commissionRateBasisPoints) / 10000;

                  let transaction : Transaction = {
                    memberId = sponsorId;
                    commissionAmount = commission;
                    date = Time.now();
                    level;
                    productPrice;
                    sponsorBonus = 0;
                  };

                  let existingTxs = switch (transactions.get(sponsorId)) {
                    case (null) { List.empty<Transaction>() };
                    case (?txs) { txs };
                  };

                  existingTxs.add(transaction);
                  transactions.add(sponsorId, existingTxs);

                  level += 1;
                  currentMemberId := ?sponsorId;
                };
              };
            };
          };
        };
      };
    };
  };

  func applySponsorBonus(memberId : MemberId, productPrice : Nat) : () {
    let sponsorBonusRate = 5;

    switch (memberProfiles.get(memberId)) {
      case (null) { Runtime.trap("Member profile not found") };
      case (?profile) {
        switch (profile.registrationFields.sponsorId) {
          case (null) { return };
          case (?sponsorId) {
            if (not memberProfiles.containsKey(sponsorId)) {
              return;
            };

            let sponsorBonus = (productPrice * sponsorBonusRate) / 100;

            let transaction : Transaction = {
              memberId = sponsorId;
              commissionAmount = 0;
              date = Time.now();
              level = 1;
              productPrice;
              sponsorBonus;
            };

            let existingTxs = switch (transactions.get(sponsorId)) {
              case (null) { List.empty<Transaction>() };
              case (?txs) { txs };
            };

            existingTxs.add(transaction);
            transactions.add(sponsorId, existingTxs);
          };
        };
      };
    };
  };

  public shared ({ caller }) func createPurchase(buyerName : Text, contact : Text, address : Text, productId : Nat) : async () {
    validateCallerHasCompleteProfile(caller);

    if (buyerName == "") {
      Runtime.trap("Nama pembeli harus diisi.");
    };

    if (contact == "") {
      Runtime.trap("Nomor kontak harus diisi.");
    };

    if (address == "") {
      Runtime.trap("Alamat harus diisi.");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Produk tidak ditemukan") };
      case (?_product) {
        let purchase : Purchase = {
          id = currentPurchaseId;
          buyerName;
          contact;
          address;
          productId;
          status = #Pending;
          purchaseDate = Time.now();
        };

        purchases.add(currentPurchaseId, purchase);
        currentPurchaseId += 1;
      };
    };
  };

  public shared ({ caller }) func updatePurchaseStatus(purchaseId : Nat, status : PurchaseStatus) : async () {
    validateCallerIsAdmin(caller);

    switch (purchases.get(purchaseId)) {
      case (null) { Runtime.trap("Purchase not found.") };
      case (?purchase) {
        let updatedPurchase = {
          id = purchase.id;
          buyerName = purchase.buyerName;
          contact = purchase.contact;
          address = purchase.address;
          productId = purchase.productId;
          status;
          purchaseDate = purchase.purchaseDate;
        };
        purchases.add(purchaseId, updatedPurchase);
      };
    };
  };

  public query ({ caller }) func getPurchase(purchaseId : Nat) : async ?Purchase {
    validateCallerIsAdmin(caller);
    purchases.get(purchaseId);
  };

  public query ({ caller }) func getAllPurchases() : async [Purchase] {
    validateCallerIsAdmin(caller);
    let purchasesIter = purchases.values();
    purchasesIter.toArray();
  };

  public shared ({ caller }) func approveMembershipRequest(requestId : Nat) : async () {
    validateCallerIsAdmin(caller);

    switch (membershipRequests.get(requestId)) {
      case (null) { Runtime.trap("Membership request not found") };
      case (?request) {
        let updatedRequest = {
          id = request.id;
          memberProfile = request.memberProfile;
          status = #Approved;
        };
        membershipRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func rejectMembershipRequest(requestId : Nat) : async () {
    validateCallerIsAdmin(caller);

    switch (membershipRequests.get(requestId)) {
      case (null) { Runtime.trap("Membership request not found") };
      case (?request) {
        let updatedRequest = {
          id = request.id;
          memberProfile = request.memberProfile;
          status = #Rejected;
        };
        membershipRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func recordAchievement(description : Text) : async () {
    validateCallerHasCompleteProfile(caller);

    if (description == "") {
      Runtime.trap("Deskripsi pencapaian harus diisi.");
    };

    let achievement : Achievement = {
      id = currentAchievementId;
      memberId = caller;
      description;
      achievedAt = Time.now();
    };

    let existingAchievements = switch (achievements.get(caller)) {
      case (null) { List.empty<Achievement>() };
      case (?achievementsList) { achievementsList };
    };

    existingAchievements.add(achievement);
    achievements.add(caller, existingAchievements);

    currentAchievementId += 1;
  };

  public query ({ caller }) func getAchievements(memberId : MemberId) : async [Achievement] {
    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own achievements");
    };

    switch (achievements.get(memberId)) {
      case (null) { [] };
      case (?achievementsList) { achievementsList.toArray() };
    };
  };

  public query ({ caller }) func getLeaderboard(leaderboardType : { #SalesVolume ; #DownlineCount }) : async [(Principal, Nat)] {
    validateCallerHasCompleteProfile(caller);

    switch (leaderboardType) {
      case (#SalesVolume) {
        let salesVolumeMap : Map<Principal, Nat> = Map.empty();

        for ((_, record) in salesRecords.entries()) {
          let currentVolume = switch (salesVolumeMap.get(record.memberId)) {
            case (null) { 0 };
            case (?volume) { volume };
          };
          salesVolumeMap.add(record.memberId, currentVolume + record.totalAmount);
        };

        let entriesIter = salesVolumeMap.entries();
        entriesIter.toArray();
      };
      case (#DownlineCount) {
        let downlineCountMap : Map<Principal, Nat> = Map.empty();

        for ((id, _) in memberProfiles.entries()) {
          let count = countDirectDownlines(id);
          downlineCountMap.add(id, count);
        };

        let entriesIter = downlineCountMap.entries();
        entriesIter.toArray();
      };
    };
  };

  func countDirectDownlines(sponsorId : MemberId) : Nat {
    var count = 0;
    for ((_, profile) in memberProfiles.entries()) {
      switch (profile.registrationFields.sponsorId) {
        case (null) {};
        case (?id) {
          if (id == sponsorId) {
            count += 1;
          };
        };
      };
    };
    count;
  };

  public query ({ caller }) func getFamilyTree(memberId : MemberId) : async FamilyTreeNode {
    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own family tree");
    };

    switch (memberProfiles.get(memberId)) {
      case (null) { Runtime.trap("Member not found.") };
      case (?profile) {
        let children = getDirectDescendants(memberId);
        {
          memberId;
          basic = profile.basic;
          registrationFields = profile.registrationFields;
          children = children.toArray();
        };
      };
    };
  };

  func getDirectDescendants(memberId : MemberId) : List.List<FamilyTreeNode> {
    let descendants = List.empty<FamilyTreeNode>();
    for ((childId, profile) in memberProfiles.entries()) {
      switch (profile.registrationFields.sponsorId) {
        case (null) {};
        case (?id) {
          if (id == memberId) {
            let children = getDirectDescendants(childId);
            let childNode = {
              memberId = childId;
              basic = profile.basic;
              registrationFields = profile.registrationFields;
              children = children.toArray();
            };
            descendants.add(childNode);
          };
        };
      };
    };
    descendants;
  };

  let purpleTheme : Theme = {
    primaryColor = "#800080";
    secondaryColor = "#A020F0";
    accentColor = "#FF69B4";
    backgroundColor = "#FFFFFF";
  };

  public query func getThemeSettings() : async Theme {
    purpleTheme;
  };

  public shared ({ caller }) func initializeDefaultInternetPackages() : async () {
    validateCallerIsAdmin(caller);

    let defaultPackages = [
      { name = "NEO"; description = "100 Mbps"; price = 233_100; commissionRate = 25; explanation = "Komisi 25%" },
      { name = "VELO"; description = "300 Mbps"; price = 277_500; commissionRate = 25; explanation = "Komisi 25%" },
      { name = "NEXUS"; description = "400 Mbps"; price = 333_000; commissionRate = 25; explanation = "Komisi 25%" },
      { name = "PRIME"; description = "500 Mbps"; price = 555_000; commissionRate = 25; explanation = "Komisi 25%" },
      { name = "WONDER"; description = "750 Mbps"; price = 721_000; commissionRate = 25; explanation = "Komisi 25%" },
      { name = "ULTRA"; description = "1 Gbps"; price = 943_500; commissionRate = 25; explanation = "Komisi 25%" },
    ];

    for (pkg in defaultPackages.values()) {
      let product : Product = {
        id = currentProductId;
        name = pkg.name;
        description = pkg.description;
        price = pkg.price;
        commissionRate = 25;
        explanation = "Komisi: 25%";
      };
      products.add(currentProductId, product);
      currentProductId += 1;
    };
  };

  public query ({ caller }) func getAllMembers() : async [(MemberId, MemberProfile)] {
    validateCallerIsAdmin(caller);
    memberProfiles.toArray();
  };

  public type FormSubmissionStatus = {
    #Success : ContactFormId;
    #Error : Text;
  };

  public query func getProductPrice(productId : Nat) : async ?Nat {
    switch (products.get(productId)) {
      case (null) { null };
      case (?product) { ?product.price };
    };
  };

  public shared ({ caller }) func submitPreWhatsAppContactForm(form : PreWhatsAppContactForm) : async FormSubmissionStatus {
    if (caller.isAnonymous()) {
      return #Error("Unauthorized: Please authenticate to submit contact form");
    };

    validateCallerIsUser(caller);

    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not isMemberProfileComplete(caller)) {
        return #Error("Unauthorized: Profile completion required. Please complete your profile before accessing this feature.");
      };
    };

    if (form.customerName == "") {
      return #Error("Nama pelanggan wajib diisi.");
    };

    if (form.phoneNumber == "") {
      return #Error("Nomor HP wajib diisi.");
    };

    if (form.customerAddress == "") {
      return #Error("Alamat pelanggan wajib diisi.");
    };

    switch (products.get(form.productId)) {
      case (null) { return #Error("Produk tidak ditemukan") };
      case (?product) {
        let submission : ContactFormSubmission = {
          id = currentContactFormId;
          submittedBy = caller;
          customerName = form.customerName;
          phoneNumber = form.phoneNumber;
          customerAddress = form.customerAddress;
          coordinates = form.coordinates;
          productId = form.productId;
          packagePrice = product.price;
          submittedAt = Time.now();
        };

        contactFormSubmissions.add(currentContactFormId, submission);
        let submissionId = currentContactFormId;
        currentContactFormId += 1;
        #Success(submissionId);
      };
    };
  };

  public shared ({ caller }) func requestWithdrawal(amount : Nat) : async WithdrawalId {
    validateCallerHasCompleteProfile(caller);

    let profile = switch (memberProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found.") };
      case (?p) { p };
    };

    let bankAccount = switch (profile.registrationFields.bankAccount) {
      case (null) { Runtime.trap("Nomor rekening bank tidak ditemukan di profil.") };
      case (?acc) {
        if (acc == "") {
          Runtime.trap("Nomor rekening bank tidak ditemukan di profil.");
        };
        acc;
      };
    };

    if (amount == 0) {
      Runtime.trap("Jumlah penarikan harus lebih dari 0");
    };

    let availableBalance = calculateAvailableBalance(caller);

    if (amount > availableBalance) {
      Runtime.trap("Saldo tidak mencukupi untuk penarikan ini");
    };

    let withdrawal : Withdrawal = {
      requestId = currentWithdrawalId;
      memberId = caller;
      amount;
      bankAccount;
      status = #Pending;
      requestDate = Time.now();
    };

    withdrawals.add(currentWithdrawalId, withdrawal);
    let withdrawalId = currentWithdrawalId;
    currentWithdrawalId += 1;
    withdrawalId;
  };

  public shared ({ caller }) func approveWithdrawal(withdrawalId : WithdrawalId) : async () {
    validateCallerIsAdmin(caller);

    let withdrawal = switch (withdrawals.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal request not found.") };
      case (?w) { w };
    };

    if (withdrawal.status != #Pending) {
      Runtime.trap("Only pending withdrawal requests can be approved.");
    };

    let updatedWithdrawal = { withdrawal with status = #Approved };
    withdrawals.add(withdrawalId, updatedWithdrawal);
  };

  public shared ({ caller }) func rejectWithdrawal(withdrawalId : WithdrawalId) : async () {
    validateCallerIsAdmin(caller);

    let withdrawal = switch (withdrawals.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal request not found.") };
      case (?w) { w };
    };

    if (withdrawal.status != #Pending) {
      Runtime.trap("Only pending withdrawal requests can be rejected.");
    };

    let updatedWithdrawal = { withdrawal with status = #Rejected };
    withdrawals.add(withdrawalId, updatedWithdrawal);
  };

  public shared ({ caller }) func markWithdrawalAsPaid(withdrawalId : WithdrawalId) : async () {
    validateCallerIsAdmin(caller);

    let withdrawal = switch (withdrawals.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal request not found.") };
      case (?w) { w };
    };

    if (withdrawal.status != #Approved) {
      Runtime.trap("Only approved withdrawal requests can be marked as paid.");
    };

    let updatedWithdrawal = { withdrawal with status = #Paid };
    withdrawals.add(withdrawalId, updatedWithdrawal);
  };

  public query ({ caller }) func getWithdrawal(withdrawalId : WithdrawalId) : async ?Withdrawal {
    switch (withdrawals.get(withdrawalId)) {
      case (null) { null };
      case (?withdrawal) {
        if (caller != withdrawal.memberId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own withdrawal requests");
        };
        ?withdrawal;
      };
    };
  };

  public query ({ caller }) func getAllWithdrawals() : async [Withdrawal] {
    validateCallerIsAdmin(caller);
    let withdrawalsIter = withdrawals.values();
    withdrawalsIter.toArray();
  };

  public query ({ caller }) func getMemberWithdrawals(memberId : MemberId) : async [Withdrawal] {
    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own withdrawal requests");
    };

    let withdrawalsIter = withdrawals.values();
    let filtered = withdrawalsIter.filter(func(w) { w.memberId == memberId });
    filtered.toArray();
  };

  public query ({ caller }) func getAllByStatus(status : WithdrawalStatus) : async [Withdrawal] {
    validateCallerIsAdmin(caller);
    let withdrawalsIter = withdrawals.values();
    let filtered = withdrawalsIter.filter(func(w) { w.status == status });
    filtered.toArray();
  };

  public query ({ caller }) func getPendingWithdrawals() : async [Withdrawal] {
    validateCallerIsAdmin(caller);
    let withdrawalsIter = withdrawals.values();
    let filtered = withdrawalsIter.filter(func(w) { w.status == #Pending });
    filtered.toArray();
  };

  public query ({ caller }) func getApprovedWithdrawals() : async [Withdrawal] {
    validateCallerIsAdmin(caller);
    let withdrawalsIter = withdrawals.values();
    let filtered = withdrawalsIter.filter(func(w) { w.status == #Approved });
    filtered.toArray();
  };

  func calculateAvailableBalance(memberId : MemberId) : Nat {
    var totalCommissions = 0;
    var totalWithdrawals = 0;

    switch (transactions.get(memberId)) {
      case (null) {};
      case (?txs) {
        for (transaction in txs.values()) {
          totalCommissions += transaction.commissionAmount;
        };
      };
    };

    for ((_, withdrawal) in withdrawals.entries()) {
      if (withdrawal.memberId == memberId and withdrawal.status == #Paid) {
        totalWithdrawals += withdrawal.amount;
      };
    };

    if (totalCommissions >= totalWithdrawals) {
      totalCommissions - totalWithdrawals;
    } else {
      0;
    };
  };

  public query ({ caller }) func getMemberWithdrawalSummary(memberId : MemberId) : async {
    availableBalance : Nat;
    totalWithdrawn : Nat;
    pendingWithdrawals : Nat;
    approvedWithdrawals : Nat;
    rejectedWithdrawals : Nat;
  } {
    if (caller != memberId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own withdrawal summary");
    };

    var totalWithdrawn = 0;
    var pendingWithdrawals = 0;
    var approvedWithdrawals = 0;
    var rejectedWithdrawals = 0;

    for ((_, withdrawal) in withdrawals.entries()) {
      if (withdrawal.memberId == memberId) {
        switch (withdrawal.status) {
          case (#Pending) { pendingWithdrawals += 1 };
          case (#Approved) { approvedWithdrawals += 1 };
          case (#Rejected) { rejectedWithdrawals += 1 };
          case (#Paid) { totalWithdrawn += withdrawal.amount };
        };
      };
    };

    {
      availableBalance = calculateAvailableBalance(memberId);
      totalWithdrawn;
      pendingWithdrawals;
      approvedWithdrawals;
      rejectedWithdrawals;
    };
  };

  public query func getProfessionalIncentiveScheme() : async {
    incentiveComponents : [IncentiveComponent];
    note : Text;
  } {
    let incentiveComponents = [
      {
        id = 1;
        name = "Sales Pribadi";
        percentage = 25.0;
        description = "Komisi 25% dari penjualan langsung ke pelanggan";
      },
      {
        id = 2;
        name = "Sponsor Langsung";
        percentage = 10.0;
        description = "Bonus 10% untuk sponsor langsung saat anggota yang disponsori melakukan penjualan";
      },
      {
        id = 3;
        name = "Team Builder";
        percentage = 7.0;
        description = "Bonus 7% dari pengembangan tim dan kinerja penjualan";
      },
      {
        id = 4;
        name = "Leadership Bonus";
        percentage = 5.0;
        description = "Bonus 5% untuk prestasi kepemimpinan dan pembinaan tim";
      },
      {
        id = 5;
        name = "Growth & Reward Pool";
        percentage = 3.0;
        description = "Bonus 3% dari pertumbuhan perusahaan dan pool prestasi";
      },
    ];
    let note = "Seluruh insentif diberikan berdasarkan kinerja penjualan dan pemasangan pelanggan yang tervalidasi. Tidak ada insentif yang berasal dari biaya pendaftaran atau aktivitas perekrutan.";
    {
      incentiveComponents;
      note;
    };
  };
};
