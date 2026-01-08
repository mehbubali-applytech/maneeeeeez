import MetaData from "@/hooks/useMetaData";
import Wrapper from "@/components/layouts/DefaultWrapper";
import SettingsMainArea from "@/components/pagesUI/super-admin/settings/SettingsMainArea";

const SettingsPage = () => {
  return (
    <>
      <MetaData pageTitle="Platform Settings">
        <Wrapper role="super-admin">
          <SettingsMainArea />
        </Wrapper>
      </MetaData>
    </>
  );
};

export default SettingsPage;
