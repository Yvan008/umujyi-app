import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PickupLocation } from '../../types';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Check,
  X,
  Search,
  CheckCircle2,
  Store,
  ShieldCheck,
} from 'lucide-react';

export const AdminBranchesTab: React.FC = () => {
  const { deliverySettings, updateDeliverySettings, showToast } = useStore();
  const branches = deliverySettings.pickupLocations || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<PickupLocation | null>(null);

  const [formState, setFormState] = useState({
    name: '',
    address: '',
    phone: '',
    operatingHours: '',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormState({
      name: '',
      address: '',
      phone: '+250 788 ',
      operatingHours: '10:00 AM - 11:00 PM (Daily)',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: PickupLocation) => {
    setEditingBranch(branch);
    setFormState({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      operatingHours: branch.operatingHours,
      isActive: branch.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (branchId: string) => {
    const updated = branches.map((b) =>
      b.id === branchId ? { ...b, isActive: !b.isActive } : b
    );
    updateDeliverySettings({ pickupLocations: updated });
    const target = branches.find((b) => b.id === branchId);
    showToast(
      `Branch "${target?.name}" ${!target?.isActive ? 'activated' : 'paused'}`,
      'info'
    );
  };

  const handleDelete = (branch: PickupLocation) => {
    if (branches.length <= 1) {
      showToast('At least one branch location must remain configured.', 'error');
      return;
    }
    if (confirm(`Are you sure you want to delete the branch "${branch.name}"?`)) {
      const updated = branches.filter((b) => b.id !== branch.id);
      updateDeliverySettings({ pickupLocations: updated });
      showToast(`Branch "${branch.name}" deleted`, 'success');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.address.trim()) {
      showToast('Please provide both a branch name and physical address', 'error');
      return;
    }

    if (editingBranch) {
      const updated = branches.map((b) =>
        b.id === editingBranch.id
          ? {
              ...b,
              name: formState.name.trim(),
              address: formState.address.trim(),
              phone: formState.phone.trim(),
              operatingHours: formState.operatingHours.trim(),
              isActive: formState.isActive,
            }
          : b
      );
      updateDeliverySettings({ pickupLocations: updated });
      showToast(`Branch "${formState.name}" updated successfully`, 'success');
    } else {
      const newBranch: PickupLocation = {
        id: `pic-${Date.now()}`,
        name: formState.name.trim(),
        address: formState.address.trim(),
        phone: formState.phone.trim() || '+250 788 123 456',
        operatingHours: formState.operatingHours.trim() || '10:00 AM - 11:00 PM (Daily)',
        isActive: formState.isActive,
      };
      updateDeliverySettings({ pickupLocations: [...branches, newBranch] });
      showToast(`New branch "${formState.name}" added successfully`, 'success');
    }

    setIsModalOpen(false);
  };

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = branches.filter((b) => b.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#111111] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#F51B55]" />
            <span>Branch Outlets & Pickup Hubs</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your physical kitchen locations, customer pickup points, and branch operating hours across Kigali
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#F51B55] hover:bg-[#d41446] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-pink-500/20 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Summary KPI Bar & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Outlets</p>
            <p className="text-xl font-black text-[#111111]">{branches.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Active Pickup Hubs</p>
            <p className="text-xl font-black text-emerald-600">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#F51B55] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Kigali Coverage</p>
            <p className="text-xs font-bold text-neutral-800">Gasabo, Nyarugenge, Kicukiro</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-neutral-400 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search branches by name, street, or phone..."
          className="w-full text-xs font-medium text-neutral-800 bg-transparent focus:outline-none placeholder:text-neutral-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-neutral-400 hover:text-neutral-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
              branch.isActive
                ? 'border-neutral-200/90 hover:border-neutral-300'
                : 'border-neutral-200/60 opacity-60 bg-neutral-50/50'
            }`}
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                    <Store className="w-4 h-4 text-[#F51B55]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#111111] leading-tight">
                      {branch.name}
                    </h3>
                    <span
                      className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1 ${
                        branch.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {branch.isActive ? 'Active for Pickup' : 'Temporarily Closed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(branch)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Branch"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(branch)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#F51B55] shrink-0 mt-0.5" />
                  <span className="leading-snug">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold">{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{branch.operatingHours}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Toggle Footer */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-medium">Pickup Availability</span>
              <button
                type="button"
                onClick={() => handleToggleStatus(branch.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  branch.isActive
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    : 'bg-[#F51B55] hover:bg-[#d41446] text-white'
                }`}
              >
                {branch.isActive ? 'Pause Branch' : 'Enable Branch'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-black text-[#111111] flex items-center gap-2">
                <Store className="w-5 h-5 text-[#F51B55]" />
                <span>{editingBranch ? 'Edit Branch Location' : 'Add New Branch Location'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Branch / Hub Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Umujyi Kacyiru Hub"
                  required
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-none focus:border-[#F51B55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Physical Address in Kigali *
                </label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  placeholder="e.g. KG 549 St, Kacyiru (Opposite US Embassy), Kigali"
                  required
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#F51B55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Branch Contact Phone Number
                </label>
                <input
                  type="text"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  placeholder="+250 788 000 000"
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono font-bold focus:outline-none focus:border-[#F51B55]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Operating & Collection Hours
                </label>
                <input
                  type="text"
                  value={formState.operatingHours}
                  onChange={(e) => setFormState({ ...formState, operatingHours: e.target.value })}
                  placeholder="10:00 AM - 11:00 PM (Daily)"
                  className="w-full p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#F51B55]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#F51B55] rounded"
                  />
                  <span>Active for customer pickup orders</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F51B55] hover:bg-[#d41446] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-pink-500/20"
                >
                  {editingBranch ? 'Update Branch' : 'Add Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
