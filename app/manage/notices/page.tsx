// app/manage/notices/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Notice {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface NoticeFormData {
  title: string;
  content: string;
  is_active: boolean;
  priority: number;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<NoticeFormData>({
    title: "",
    content: "",
    is_active: true,
    priority: 0,
  });

  const supabase = createClient();

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setNotices(data || []);
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
      setMessage("❌ 공지사항을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (editingNotice) {
        // 수정
        const { error } = await supabase
          .from("notices")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingNotice.id);

        if (error) throw error;
        setMessage("✅ 공지사항이 수정되었습니다!");
      } else {
        // 새로 추가
        const { error } = await supabase
          .from("notices")
          .insert([formData]);

        if (error) throw error;
        setMessage("✅ 공지사항이 추가되었습니다!");
      }

      resetForm();
      await loadNotices();
    } catch (error) {
      console.error("저장 실패:", error);
      setMessage("❌ 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      is_active: notice.is_active,
      priority: notice.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 이 공지사항을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("notices")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMessage("✅ 공지사항이 삭제되었습니다!");
      await loadNotices();
    } catch (error) {
      console.error("삭제 실패:", error);
      setMessage("❌ 삭제에 실패했습니다.");
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("notices")
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setMessage(`✅ 공지사항이 ${!currentStatus ? '활성화' : '비활성화'}되었습니다!`);
      await loadNotices();
    } catch (error) {
      console.error("상태 변경 실패:", error);
      setMessage("❌ 상태 변경에 실패했습니다.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      is_active: true,
      priority: 0,
    });
    setEditingNotice(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 3) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">긴급</span>;
    } else if (priority >= 1) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">중요</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">일반</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">공지사항을 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          <p className="text-gray-600">웹사이트 공지사항을 관리할 수 있습니다.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 공지 추가
        </button>
      </div>

      {/* 메시지 */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes("✅") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      {/* 공지사항 추가/수정 폼 */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingNotice ? "공지사항 수정" : "새 공지사항 추가"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>일반</option>
                  <option value={1}>중요</option>
                  <option value={2}>중요</option>
                  <option value={3}>긴급</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">활성화 (웹사이트에 표시)</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {saving ? "저장 중..." : (editingNotice ? "수정" : "추가")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 공지사항 목록 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">공지사항 목록 ({notices.length}개)</h2>
        </div>

        {notices.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notices.map((notice) => (
              <div key={notice.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{notice.title}</h3>
                      {getPriorityBadge(notice.priority)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        notice.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notice.is_active ? '활성' : '비활성'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 whitespace-pre-wrap">{notice.content}</p>
                    
                    <div className="text-sm text-gray-500">
                      <span>생성: {formatDate(notice.created_at)}</span>
                      {notice.updated_at !== notice.created_at && (
                        <span className="ml-4">수정: {formatDate(notice.updated_at)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(notice.id, notice.is_active)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        notice.is_active
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {notice.is_active ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={() => handleEdit(notice)}
                      className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              첫 공지사항 추가하기
            </button>
          </div>
        )}
      </div>

      {/* 도움말 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">사용 안내</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>우선순위가 높은 공지사항이 먼저 표시됩니다.</li>
                <li>비활성화된 공지사항은 웹사이트에 표시되지 않습니다.</li>
                <li>긴급 공지사항은 웹사이트 상단에 강조되어 표시됩니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

