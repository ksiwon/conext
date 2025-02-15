import styled from "styled-components";

// 헤더 컨테이너
export const HeaderContainer = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 1000;
  position: relative;
`;

// 로고와 네비게이션 묶음
export const LogoAndNav = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

// 로고
export const Logo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  align-items: center;
`;

export const LogoText = styled.div`
  font-size: ${({ theme }) => theme.typography.T1.fontSize};
  font-weight: ${({ theme }) => theme.typography.T1.fontWeight};
`

// 네비게이션 컨테이너
export const Nav = styled.nav`
  display: flex;
  align-items: center;

  @media screen and (max-width: 700px) {
    display: none;
  }
`;

// 네비게이션 아이템
export const NavItem = styled.div`
  font-size: ${({ theme }) => theme.typography.T4.fontSize};
  font-weight: ${({ theme }) => theme.typography.T4.fontWeight};
  color: ${({ theme }) => theme.colors.black};
  margin-right: 24px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    text-decoration: underline;
  }
`;

// 인증 섹션
export const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 유저 섹션 (로그인 상태)
export const UserSection = styled(AuthSection)`
  font-size: ${({ theme }) => theme.typography.T4.fontSize};
  font-weight: ${({ theme }) => theme.typography.T4.fontWeight};
  color: ${({ theme }) => theme.colors.black};
`;

// 사용자 이름
export const UserName = styled.div`
  margin-right: 16px;
  cursor: pointer;
`;

// 인증 버튼
export const AuthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.typography.T4.fontSize};
  font-weight: ${({ theme }) => theme.typography.T4.fontWeight};
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue[600]};
  }
`;
