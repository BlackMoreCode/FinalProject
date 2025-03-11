import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/AxiosInstance";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nickName: "",
    introduce: "",
    memberImg: "", // 프로필 이미지 URL
  });

  const [file, setFile] = useState<File | null>(null);

  // 프로필 데이터 로드
  useEffect(() => {
    // 처음에 유저의 프로필 데이터를 로드합니다.
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/profile/image"); // 프로필 이미지 가져오기
        const { data } = await axiosInstance.get("/api/profile/get"); // 유저 정보 가져오기
        setProfile({
          nickName: data.nickName,
          introduce: data.introduce,
          memberImg: response.data,
        });
      } catch (error) {
        console.error("프로필 정보를 가져오는 데 실패했습니다.", error);
      }
    };
    fetchProfile();
  }, []);

  // 이미지 파일 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // 프로필 수정 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const promises = [];

      // 파일 업로드 처리
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        // 이미지 업로드 요청을 promises 배열에 추가
        promises.push(
          axiosInstance.post("/api/profile/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        );
      }

      // 프로필 수정 요청을 promises 배열에 추가
      promises.push(axiosInstance.put("/api/profile/info", profile));

      // 두 요청을 동시에 처리
      await Promise.all(promises);

      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/profile");
    } catch (error) {
      console.error("프로필 수정에 실패했습니다.", error);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  // 필드 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>프로필 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>프로필 이미지:</label>
          <input type="file" onChange={handleFileChange} />
          {profile.memberImg && <img src={profile.memberImg} alt="Profile" />}
        </div>

        <div>
          <label>닉네임:</label>
          <input
            type="text"
            name="nickName"
            value={profile.nickName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>자기소개:</label>
          <input
            type="text"
            name="introduce"
            value={profile.introduce}
            onChange={handleChange}
          />
        </div>

        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default ProfileEditPage;
