"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type WorkItem = {
  id: number;
  workName: string;
  workPlace: string;
  avgWorkMinutes: string;
  exposureMinutes: string;
};

const siteOptions = ["세종", "평택", "용인", "수원", "광교", "판교", "제이쓰리"];

export default function Page() {
  const [site, setSite] = useState("");
  const [department, setDepartment] = useState("");
  const [writer, setWriter] = useState("");

  const [noApplicable, setNoApplicable] = useState(false);
  const [items, setItems] = useState<WorkItem[]>([]);

  const [workName, setWorkName] = useState("");
  const [workPlace, setWorkPlace] = useState("");
  const [avgWorkMinutes, setAvgWorkMinutes] = useState("");
  const [exposureMinutes, setExposureMinutes] = useState("");

  const [message, setMessage] = useState("");

  const onlyNumber = (value: string) => value.replace(/[^0-9]/g, "");

  const validateBase = () => {
    if (!site) return "사업장을 선택해주세요.";
    if (!department.trim()) return "부서를 입력해주세요.";
    if (department.trim().length > 20) return "부서는 20글자 이내로 입력해주세요.";
    if (writer.trim().length < 2) return "작성자는 최소 2글자 이상 입력해주세요.";
    if (writer.trim().length > 10) return "작성자는 최대 10글자까지 입력 가능합니다.";
    return "";
  };

  const addItem = () => {
    setMessage("");

    const baseError = validateBase();
    if (baseError) return setMessage(baseError);

    if (!workName.trim()) return setMessage("작업명을 입력해주세요.");
    if (!workPlace.trim()) return setMessage("작업장소를 입력해주세요.");
    if (!avgWorkMinutes || Number(avgWorkMinutes) <= 0) {
      return setMessage("하루 평균작업시간을 입력해주세요.");
    }
    if (!exposureMinutes || Number(exposureMinutes) <= 0) {
      return setMessage("예상 하루 노출시간을 입력해주세요.");
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        workName: workName.trim(),
        workPlace: workPlace.trim(),
        avgWorkMinutes,
        exposureMinutes,
      },
    ]);

    setNoApplicable(false);
    setWorkName("");
    setWorkPlace("");
    setAvgWorkMinutes("");
    setExposureMinutes("");
  };

  const selectNoApplicable = () => {
    setItems([]);
    setNoApplicable(true);
    setMessage("우리팀은 폭염노출 작업이 없습니다.");
  };

  const submitData = async () => {
    setMessage("");

    const baseError = validateBase();
    if (baseError) return setMessage(baseError);

    if (!noApplicable && items.length === 0) {
      return setMessage("작업 항목을 추가하거나 해당없음을 선택해주세요.");
    }

    const payload = {
      title: "켐트로닉스/제이쓰리 폭염노출 외부작업 전수조사",
      site,
      department: department.trim(),
      writer: writer.trim(),
      noApplicable,
      items: noApplicable
        ? []
        : items.map((item) => ({
            workName: item.workName,
            workPlace: item.workPlace,
            avgWorkMinutes: Number(item.avgWorkMinutes),
            exposureMinutes: Number(item.exposureMinutes),
          })),
      submittedAt: new Date().toISOString(),
    };

    const res = await fetch("/api/heat-exposure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return setMessage("제출 중 오류가 발생했습니다.");

    setMessage("제출이 완료되었습니다.");
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>켐트로닉스/제이쓰리 폭염노출 외부작업 전수조사</h1>

        <p style={styles.desc}>
          6월~9월 중 폭염에 노출될 가능성이 있는 외부작업을 등록해주세요.
          해당 작업이 없는 경우에는 <b>우리팀은 폭염노출 작업이 없습니다</b> 버튼을 선택해주세요.
        </p>

        <div style={styles.formGrid}>
          <label style={styles.label}>
            사업장 선택 *
            <select value={site} onChange={(e) => setSite(e.target.value)} style={styles.input}>
              <option value="">선택</option>
              {siteOptions.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            부서 *
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value.slice(0, 20))}
              maxLength={20}
              placeholder="20글자 이내"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            작성자 *
            <input
              value={writer}
              onChange={(e) => setWriter(e.target.value.slice(0, 10))}
              maxLength={10}
              placeholder="2~10글자"
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.galleryBox}>
          <h2 style={styles.subTitle}>등록된 작업 목록</h2>

          {noApplicable ? (
            <div style={styles.emptyBox}>우리팀은 폭염노출 작업이 없습니다.</div>
          ) : items.length === 0 ? (
            <div style={styles.emptyBox}>아직 추가된 작업이 없습니다.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>작업명</th>
                  <th style={styles.th}>작업장소</th>
                  <th style={styles.th}>하루 평균작업시간</th>
                  <th style={styles.th}>예상 하루 노출시간</th>
                  <th style={styles.th}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.workName}</td>
                    <td style={styles.td}>{item.workPlace}</td>
                    <td style={styles.td}>{item.avgWorkMinutes}분</td>
                    <td style={styles.td}>{item.exposureMinutes}분</td>
                    <td style={styles.td}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.inputBox}>
          <h2 style={styles.subTitle}>작업 항목 추가</h2>

          <div style={styles.itemInputGrid}>
            <label style={styles.label}>
              작업명
              <input
                value={workName}
                onChange={(e) => setWorkName(e.target.value.slice(0, 100))}
                maxLength={100}
                placeholder="100글자 이내"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              작업장소
              <input
                value={workPlace}
                onChange={(e) => setWorkPlace(e.target.value.slice(0, 100))}
                maxLength={100}
                placeholder="100글자 이내"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              하루 평균시간
              <input
                value={avgWorkMinutes}
                onChange={(e) => setAvgWorkMinutes(onlyNumber(e.target.value))}
                inputMode="numeric"
                placeholder="분"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              하루 노출시간
              <input
                value={exposureMinutes}
                onChange={(e) => setExposureMinutes(onlyNumber(e.target.value))}
                inputMode="numeric"
                placeholder="분"
                style={styles.input}
              />
            </label>

            <button onClick={addItem} style={styles.addBtn}>
              + 항목 추가
            </button>
          </div>

          <div style={styles.submitRow}>
            <button onClick={submitData} style={styles.submitBtn}>
              최종제출
            </button>

            <button onClick={selectNoApplicable} style={styles.noBtn}>
              우리팀은 폭염노출 작업이 없습니다
            </button>
          </div>

          {message && <p style={styles.message}>{message}</p>}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f3f5f7",
    padding: "32px 16px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: 1100,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
  },
  desc: {
    lineHeight: 1.6,
    color: "#444",
    marginBottom: 28,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  itemInputGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 120px 120px 130px",
    gap: 12,
    alignItems: "end",
    overflowX: "auto",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  input: {
    height: 42,
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "0 12px",
    fontSize: 15,
  },
  galleryBox: {
    marginTop: 32,
    padding: 20,
    border: "1px solid #e2e2e2",
    borderRadius: 12,
    background: "#fafafa",
    overflowX: "auto",
  },
  inputBox: {
    marginTop: 24,
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  emptyBox: {
    padding: 24,
    textAlign: "center",
    color: "#666",
    border: "1px dashed #bbb",
    borderRadius: 10,
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: 10,
    textAlign: "left",
    background: "#f0f0f0",
    whiteSpace: "nowrap",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: 10,
  },
  addBtn: {
    height: 42,
    background: "#1976d2",
    color: "#fff",
    border: 0,
    borderRadius: 8,
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  submitRow: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: 12,
    marginTop: 28,
  },
  submitBtn: {
    height: 58,
    background: "#2e7d32",
    color: "#fff",
    border: 0,
    borderRadius: 10,
    padding: "0 24px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 18,
  },
  noBtn: {
    height: 58,
    background: "#d32f2f",
    color: "#fff",
    border: 0,
    borderRadius: 10,
    padding: "0 20px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 15,
  },
  deleteBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: 0,
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
  },
  message: {
    marginTop: 16,
    fontWeight: 700,
    color: "#d32f2f",
  },
};
