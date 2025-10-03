// app/manage/components/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface ComponentText {
  id: number;
  component_name: string;
  texts: Record<string, any>;
  updated_at: string;
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

function TextField({ label, value, onChange, multiline = false, placeholder }: TextFieldProps) {
  if (multiline) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<ComponentText[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<string>("hero");

  const supabase = createClient();

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      const { data, error } = await supabase
        .from("component_texts")
        .select("*")
        .order("component_name");

      if (error) throw error;

      setComponents(data || []);
    } catch (error) {
      console.error("컴포넌트 텍스트 로드 실패:", error);
      setMessage("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const saveComponent = async (componentName: string, texts: Record<string, any>) => {
    setSaving(componentName);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("component_texts")
        .upsert([{
          component_name: componentName,
          texts: texts,
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      setMessage("✅ 저장되었습니다!");
      await loadComponents();
    } catch (error) {
      console.error("저장 실패:", error);
      setMessage("❌ 저장에 실패했습니다.");
    } finally {
      setSaving(null);
    }
  };

  const updateComponentText = (componentName: string, key: string, value: string) => {
    setComponents(prev => prev.map(comp => {
      if (comp.component_name === componentName) {
        return {
          ...comp,
          texts: {
            ...comp.texts,
            [key]: value
          }
        };
      }
      return comp;
    }));
  };

  const getComponentByName = (name: string) => {
    return components.find(comp => comp.component_name === name);
  };

  const renderHeroEditor = () => {
    const hero = getComponentByName("hero");
    if (!hero) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">히어로 섹션</h2>
          <button
            onClick={() => saveComponent("hero", hero.texts)}
            disabled={saving === "hero"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {saving === "hero" ? "저장 중..." : "저장"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <TextField
              label="메인 타이틀"
              value={hero.texts.title || ""}
              onChange={(value) => updateComponentText("hero", "title", value)}
              placeholder="SHIR BAND"
            />

            <TextField
              label="서브 타이틀"
              value={hero.texts.subtitle || ""}
              onChange={(value) => updateComponentText("hero", "subtitle", value)}
              placeholder="SPIRIT & TRUTH WORSHIP"
            />

            <TextField
              label="영어 성경구절"
              value={hero.texts.verse_english || ""}
              onChange={(value) => updateComponentText("hero", "verse_english", value)}
              multiline
              placeholder="that ye present your bodies a living sacrifice..."
            />
          </div>

          <div className="space-y-4">
            <TextField
              label="한국어 성경구절"
              value={hero.texts.verse_korean || ""}
              onChange={(value) => updateComponentText("hero", "verse_korean", value)}
              multiline
              placeholder="너희 몸을 하나님이 기뻐하시는..."
            />

            <TextField
              label="성경 출처"
              value={hero.texts.verse_reference || ""}
              onChange={(value) => updateComponentText("hero", "verse_reference", value)}
              placeholder="Romans 12:1"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">미리보기</h3>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{hero.texts.title}</h1>
            <h2 className="text-lg font-semibold text-gray-600">{hero.texts.subtitle}</h2>
            <p className="text-sm text-gray-600">{hero.texts.verse_english}</p>
            <p className="text-sm text-gray-600">{hero.texts.verse_korean}</p>
            <p className="text-xs text-gray-500">{hero.texts.verse_reference}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderAboutEditor = () => {
    const about = getComponentByName("about");
    if (!about) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">About 페이지</h2>
          <button
            onClick={() => saveComponent("about", about.texts)}
            disabled={saving === "about"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {saving === "about" ? "저장 중..." : "저장"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <TextField
              label="페이지 제목"
              value={about.texts.title || ""}
              onChange={(value) => updateComponentText("about", "title", value)}
              placeholder="About Us"
            />

            <TextField
              label="설명"
              value={about.texts.description || ""}
              onChange={(value) => updateComponentText("about", "description", value)}
              multiline
              placeholder="SHIR Band는 예배 공동체로서..."
            />

            <TextField
              label="비전 제목"
              value={about.texts.vision_title || ""}
              onChange={(value) => updateComponentText("about", "vision_title", value)}
              placeholder="Vision & Mission"
            />
          </div>

          <div className="space-y-4">
            <TextField
              label="비전 (한국어)"
              value={about.texts.vision_korean || ""}
              onChange={(value) => updateComponentText("about", "vision_korean", value)}
              multiline
              placeholder="우리는 신령과 진정으로..."
            />

            <TextField
              label="비전 (영어)"
              value={about.texts.vision_english || ""}
              onChange={(value) => updateComponentText("about", "vision_english", value)}
              multiline
              placeholder="We desire to see generations..."
            />
          </div>
        </div>
      </div>
    );
  };

  const renderEventsEditor = () => {
    const events = getComponentByName("events");
    if (!events) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Events 페이지</h2>
          <button
            onClick={() => saveComponent("events", events.texts)}
            disabled={saving === "events"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {saving === "events" ? "저장 중..." : "저장"}
          </button>
        </div>

        <div className="space-y-4">
          <TextField
            label="페이지 제목"
            value={events.texts.title || ""}
            onChange={(value) => updateComponentText("events", "title", value)}
            placeholder="Events"
          />

          <TextField
            label="페이지 설명"
            value={events.texts.description || ""}
            onChange={(value) => updateComponentText("events", "description", value)}
            multiline
            placeholder="예배와 찬양 모임 일정을 확인하세요."
          />
        </div>
      </div>
    );
  };

  const renderFooterEditor = () => {
    const footer = getComponentByName("footer");
    if (!footer) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">푸터</h2>
          <button
            onClick={() => saveComponent("footer", footer.texts)}
            disabled={saving === "footer"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {saving === "footer" ? "저장 중..." : "저장"}
          </button>
        </div>

        <div className="space-y-4">
          <TextField
            label="저작권 텍스트"
            value={footer.texts.copyright || ""}
            onChange={(value) => updateComponentText("footer", "copyright", value)}
            placeholder="© 2024 SHIR BAND. All rights reserved."
          />

          <TextField
            label="서브타이틀"
            value={footer.texts.subtitle || ""}
            onChange={(value) => updateComponentText("footer", "subtitle", value)}
            placeholder="Spirit & Truth Worship"
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">컴포넌트 텍스트를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">컴포넌트 텍스트 관리</h1>
        <p className="text-gray-600">웹사이트의 각 섹션별 텍스트를 수정할 수 있습니다.</p>
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

      {/* 탭 메뉴 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { key: "hero", label: "히어로 섹션" },
            { key: "about", label: "About 페이지" },
            { key: "events", label: "Events 페이지" },
            { key: "footer", label: "푸터" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveComponent(tab.key)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeComponent === tab.key
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeComponent === "hero" && renderHeroEditor()}
          {activeComponent === "about" && renderAboutEditor()}
          {activeComponent === "events" && renderEventsEditor()}
          {activeComponent === "footer" && renderFooterEditor()}
        </div>
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
                <li>각 섹션의 텍스트를 수정한 후 반드시 "저장" 버튼을 눌러주세요.</li>
                <li>변경사항은 웹사이트에 즉시 반영됩니다.</li>
                <li>HTML 태그는 사용할 수 없으며, 일반 텍스트만 입력해주세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

