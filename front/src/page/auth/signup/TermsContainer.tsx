import {TermContainer, TermLabel, TermLink, TermsCheckbox, TermsHeader, TermsWrapper} from "../Style";
import React from "react";
import {AppDispatch} from "../../../context/Store";
import {useDispatch} from "react-redux";
import {setTitleNContentModal} from "../../../context/redux/ModalReducer";
import {privacyPolicy, termsOfService} from "../../../util/Term";

interface TermsContainerProps {
  setter : (value: boolean, type: string) => void;
  serviceTerm : boolean,
  privacyTerm : boolean,
}

const TermsContainer = ({setter, serviceTerm, privacyTerm} : TermsContainerProps ) => {
  const dispatch = useDispatch<AppDispatch>();

  return(
    <>
      <TermsHeader>약관 동의</TermsHeader>
      <TermsWrapper>
        <TermContainer>
          <TermsCheckbox
            type="checkbox"
            checked={serviceTerm}
            onChange={(e) => setter(e.target.checked, "serviceTerm")}
          />
          <TermLabel>
            [필수]{" "}
            <TermLink onClick={() => dispatch(setTitleNContentModal({title: "서비스 이용약관", content: termsOfService, onCancel: () => {} }))}>
              서비스 이용약관
            </TermLink>
            에 동의합니다.
          </TermLabel>
        </TermContainer>
        <TermContainer>
          <TermsCheckbox
            type="checkbox"
            checked={privacyTerm}
            onChange={(e) => setter(e.target.checked, "privacyTerm")}
          />
          <TermLabel>
            [필수]{" "}
            <TermLink onClick={() => dispatch(setTitleNContentModal({title: "개인정보 처리방침", content: privacyPolicy, onCancel: () => {} }))}>
              개인정보 처리방침
            </TermLink>
            에 동의합니다.
          </TermLabel>
        </TermContainer>
      </TermsWrapper>
    </>
  )
}
export default TermsContainer;