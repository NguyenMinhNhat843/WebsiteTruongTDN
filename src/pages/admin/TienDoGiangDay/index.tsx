import TableTienDoDaoTao from "./tableTienDoDaoTao/TableTienDoDaoTao";
import { TienDoDaoTaoProvider } from "./TienDoDaoTaoProvider";

const TienDoDaoTao = () => {
  return (
    <TienDoDaoTaoProvider>
      <TableTienDoDaoTao />
    </TienDoDaoTaoProvider>
  );
};

export default TienDoDaoTao;
