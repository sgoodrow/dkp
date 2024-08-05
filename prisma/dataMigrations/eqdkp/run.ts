import dayjs from "dayjs";
import { eqdkpDataMigration } from "prisma/dataMigrations/eqdkp/main";

eqdkpDataMigration({ lastVisitedAt: dayjs().subtract(1, "year").toDate() });
