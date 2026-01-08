import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import GeneralSettingsMainArea from "@/components/pagesUI/super-admin/settings/general/GeneralSettingsMainArea";

const SettingsPage = () => {
  return (
    <>
      <MetaData pageTitle="Platform Settings">
        <Wrapper role="super-admin">
          <GeneralSettingsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default SettingsPage;
