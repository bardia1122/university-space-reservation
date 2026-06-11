import { mockUsers } from '../../mock/data';
import { Badge } from '../../components/common/Badge';

const roleLabels: Record<string, { label: string; variant: 'blue' | 'purple' | 'red' | 'green' }> = {
  student: { label: 'دانشجو', variant: 'blue' },
  organization: { label: 'تشکل دانشجویی', variant: 'purple' },
  admin: { label: 'مدیر', variant: 'red' },
  super_admin: { label: 'سوپر ادمین', variant: 'red' },
};

export function AdminUsersPage() {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs">
              <th className="px-4 py-3 font-semibold text-right">نام</th>
              <th className="px-4 py-3 font-semibold text-right hidden md:table-cell">ایمیل</th>
              <th className="px-4 py-3 font-semibold text-right hidden sm:table-cell">دانشکده</th>
              <th className="px-4 py-3 font-semibold text-right hidden lg:table-cell">شماره دانشجویی</th>
              <th className="px-4 py-3 font-semibold text-right">نقش</th>
              <th className="px-4 py-3 font-semibold text-right">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockUsers.map((user) => {
              const role = roleLabels[user.role];
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 text-xs font-semibold">
                          {user.full_name[0]}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{user.department ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{user.student_id ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={role?.variant ?? 'gray'} label={role?.label ?? user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.is_active ? 'approved' : 'rejected'} label={user.is_active ? 'فعال' : 'غیرفعال'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
