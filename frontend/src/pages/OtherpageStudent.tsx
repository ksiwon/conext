import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styled from 'styled-components';
import boy from '../assets/boy.png';
import girl from '../assets/girl.png';
import SubjectBig from '../components/SubjectBig';
import Title from '../components/Title';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

function getAge(birth: string): number {
    const today = new Date();
    const birthDate = new Date(birth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

const apiUrl = process.env.REACT_APP_API_URL;

const OtherpageStudent: React.FC = () => {
    const { id: studentId } = useParams<{ id: string }>(); // URL에서 studentId 읽기
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState<any>(null); // API로 가져온 데이터를 저장
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 관리

    const user = useSelector((state: RootState) => state.user.teacherData);
    const myId = user?.id;

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // API 호출로 student 정보를 가져옴
                const response = await axios.post(`${apiUrl}/api/students/find`, {
                    id: studentId,
                });

                setStudentData(response.data); // 데이터 상태에 저장
            } catch (err: any) {
                console.error("Error fetching student data:", err);
                alert("해당하는 학생을 찾을 수 없습니다.");
                navigate("/search/student"); // 실패 시 student 검색 페이지로 이동
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        if (studentId) {
            fetchStudentData();
        } else {
            setLoading(false); // studentId가 없는 경우 로딩 해제
            alert("유효하지 않은 요청입니다.");
            navigate("/search/student");
        }
    }, [studentId, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!studentData) {
        return <div>No student data found</div>;
    }

    return (
        <GlobalWrapper>
            <Header />
            <Title text="Student Page" />
            <WholeFrame>
                <TopFrame>
                    <ImageFrame imageUrl={(studentData.gender === '남성') ? boy : girl} />
                    <ContentWrapper>
                        <ContentFrame>
                            <Content>
                                <ContentName>이름</ContentName>
                                <ContentInput>{studentData.name}</ContentInput>
                            </Content>
                            <Content>
                                <ContentName>성별</ContentName>
                                <ContentInput>{studentData.gender}</ContentInput>
                            </Content>
                            <Content>
                                <ContentName>나이</ContentName>
                                <ContentInput>만 {getAge(studentData.birth)}세</ContentInput>
                            </Content>
                        </ContentFrame>
                        <ContentFrame>
                            <Content>
                                <ContentName>학년</ContentName>
                                <ContentInput>{studentData.gradeHighschool} ({studentData.school})</ContentInput>
                            </Content>
                            <Content>
                                <ContentName>대면 여부</ContentName>
                                <ContentInput>
                                    {Array.isArray(studentData.face) 
                                    ? studentData.face.join(', ') 
                                    : studentData.face}
                                </ContentInput>
                            </Content>
                        </ContentFrame>
                        <ContentFrame>
                            <Content>
                                <ContentName>지역</ContentName>
                                <ContentInput>{studentData.city} {studentData.district} {studentData.neighborhood}</ContentInput>
                            </Content>
                            <Content>
                                <ContentName>수업 장소</ContentName>
                                <ContentInput>
                                    {Array.isArray(studentData.location) 
                                    ? studentData.location.join(', ') 
                                    : studentData.location}
                                </ContentInput>
                            </Content>
                        </ContentFrame>
                        <Content>
                            <ContentName>과목</ContentName>
                            <ContentInput>
                                <SubjectBig subjects={studentData.subject.map((subject: string) => {
                                    switch (subject) {
                                        case "국어":
                                            return "국어";
                                        case "영어":
                                            return "영어";
                                        case "수학":
                                            return "수학";
                                        case "물리학":
                                            return "물리";
                                        case "화학":
                                            return "화학";
                                        case "생명과학":
                                            return "생물";
                                        case "지구과학":
                                            return "지학";
                                        case "정보/코딩":
                                            return "정보";
                                        default:
                                            return subject;
                                    }
                                })} />
                            </ContentInput>
                        </Content>
                    </ContentWrapper>
                </TopFrame>
                <BottomFrame>
                    <ContentFrame>
                        <ContentTemp>
                            <ContentName>선호 성별</ContentName>
                            <ContentInput>{studentData.prefered_gender.join(', ')}</ContentInput>
                        </ContentTemp>
                        <Content>
                            <ContentName>선호 성격</ContentName>
                            <ContentInput>
                                {Array.isArray(studentData.prefered_personality) 
                                ? studentData.prefered_personality.join(', ') 
                                : studentData.prefered_personality}
                            </ContentInput>
                        </Content>
                        <Content>
                            <ContentName>선호 성향</ContentName>
                            <ContentInput>
                                {Array.isArray(studentData.prefered_tendency) 
                                ? studentData.prefered_tendency.join(', ') 
                                : studentData.prefered_tendency}
                            </ContentInput>
                        </Content>
                    </ContentFrame>
                    <Content>
                        <ContentName>선호 대학</ContentName>
                        <ContentInput>{studentData.prefered_school.join(', ')}</ContentInput>
                    </Content>
                    <Content>
                        <ContentName>희망 금액</ContentName>
                        <ContentInput>{studentData.payWant} (시간 당)</ContentInput>
                    </Content>
                    <Content style={{ height: '100px' }}>
                        <ContentName>소개</ContentName>
                        <ContentInput>{studentData.introduction}</ContentInput>
                    </Content>
                    <Content style={{ height: '300px' }}>
                        <ContentName>상세 내용</ContentName>
                        <ContentInput>{studentData.detail}</ContentInput>
                    </Content>
                </BottomFrame>
            </WholeFrame>
            <ButtonContainer>
                <Button1 onClick={() => navigate(-1)}>이전</Button1>
                <Button2 onClick={() => navigate("/chat/"+myId+"/"+studentId)}>문의하기</Button2>
            </ButtonContainer>
            <Footer />
        </GlobalWrapper>
    );
};

export default OtherpageStudent;

const GlobalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[100]};
`;

const ImageFrame = styled.div<{ imageUrl: string }>`
    width: 208px;
    height: 208px;
    flex-shrink: 0;
    border-radius: 32px;
    border: 4px solid ${({ theme }) => theme.colors.primary};
    background: url(${({ imageUrl }) => imageUrl}) transparent -17.226px -17.226px / 116.129% 116.129% no-repeat;
`;

const ContentName = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 100px;
    height: 100%;
    font-size: ${({ theme }) => theme.typography.T4.fontSize};
    font-weight: ${({ theme }) => theme.typography.T4.fontWeight};
    color: ${({ theme }) => theme.colors.primary};
    text-align: center;
    justify-content: center;
`;

const ContentInput = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: left;
    justify-content: center;
    font-size: ${({ theme }) => theme.typography.T5.fontSize};
    font-weight: ${({ theme }) => theme.typography.T5.fontWeight};
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    padding: 0 16px;
`;

const Content = styled.div<{ height?: string, width?: string }>`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    align-items: center;
    border-radius: 8px;
`;

const ContentTemp = styled.div`
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    width: 200px;
    height: 40px;
    align-items: center;
    border-radius: 8px;
`;

const ContentFrame = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    gap: 8px;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
`;

const TopFrame = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin: 0 auto;
`;

const BottomFrame = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin: 0 auto;
`;

const WholeFrame = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px 10%;
    box-sizing: border-box;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 32px;
    justify-content: center;
    background: ${({ theme }) => theme.colors.primary};
    padding: 16px 0;
`;

const Button1 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.white};
    width: 144px;
    height: 48px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.gray[400]};

    align-item: center;
    font-size: ${({ theme }) => theme.typography.T2.fontSize};
    font-weight: ${({ theme }) => theme.typography.T2.fontWeight};
    cursor: pointer;
`

const Button2 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.primary};
    width: 144px;
    height: 48px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.white};

    align-item: center;
    font-size: ${({ theme }) => theme.typography.T2.fontSize};
    font-weight: ${({ theme }) => theme.typography.T2.fontWeight};
    cursor: pointer;
`