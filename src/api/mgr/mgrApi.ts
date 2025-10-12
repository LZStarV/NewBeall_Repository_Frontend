import http from '@/utils/http';

// POST /mgr/hasPermission?permission=/approval/detail_audit 验证权限
export function hasPermission(permissionPath: string) {
  return http.post<{ code: string; data: boolean; msg: string }>(
    `/mgr/hasPermission?permission=${permissionPath}`,
  );
}
