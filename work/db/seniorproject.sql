-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 17, 2022 at 05:54 PM
-- Server version: 10.6.5-MariaDB-1:10.6.5+maria~focal
-- PHP Version: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seniorproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `abstracts`
--

CREATE TABLE `abstracts` (
  `Abstract_ID` int(11) NOT NULL,
  `Abstract_Name` text NOT NULL,
  `Submit_Date` timestamp NOT NULL DEFAULT current_timestamp(),
  `Group_ID` int(11) NOT NULL,
  `Project_on_term_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `academicyear`
--

CREATE TABLE `academicyear` (
  `Academic_Year` int(4) NOT NULL,
  `Created_Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `academicyear`
--

INSERT INTO `academicyear` (`Academic_Year`, `Created_Date`) VALUES
(2021, '2021-05-12');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `Announcement_ID` int(11) NOT NULL,
  `Text` text NOT NULL,
  `Publish_Date` timestamp NOT NULL DEFAULT current_timestamp(),
  `Major_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `Assignment_ID` int(11) NOT NULL,
  `Submit_Date` timestamp NOT NULL DEFAULT current_timestamp(),
  `Progress_ID` int(11) NOT NULL,
  `Group_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `evalcomment`
--

CREATE TABLE `evalcomment` (
  `Eval_Comment_ID` int(11) NOT NULL,
  `Comment` text NOT NULL,
  `File_Name` text DEFAULT NULL,
  `Re_Eval` int(1) NOT NULL DEFAULT 0,
  `Group_Member_ID` int(11) NOT NULL,
  `Group_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `File_ID` int(11) NOT NULL,
  `File_Name` text NOT NULL,
  `Path` varchar(255) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `Assignment_ID` int(11) NOT NULL,
  `Group_Member_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `gradecriterias`
--

CREATE TABLE `gradecriterias` (
  `Grade_Criteria_ID` int(11) NOT NULL,
  `Grade_Criteria_Name` varchar(2) NOT NULL,
  `Grade_Criteria_Pass` int(3) NOT NULL,
  `Major_ID` int(11) NOT NULL,
  `Project_on_term_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `groupmembers`
--

CREATE TABLE `groupmembers` (
  `Group_Member_ID` int(11) NOT NULL,
  `User_Email` varchar(40) NOT NULL,
  `User_Status` int(1) NOT NULL DEFAULT 0,
  `User_Phone` varchar(11) DEFAULT NULL,
  `Group_Role` int(1) NOT NULL,
  `Group_ID` int(11) NOT NULL,
  `Project_on_term_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `groupmemberstatus`
--

CREATE TABLE `groupmemberstatus` (
  `Member_Status_ID` int(1) NOT NULL,
  `Member_Status_Name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `groupmemberstatus`
--

INSERT INTO `groupmemberstatus` (`Member_Status_ID`, `Member_Status_Name`) VALUES
(0, 'Pending'),
(1, 'Active'),
(2, 'Left');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `Group_ID` int(11) NOT NULL,
  `Group_Name_Thai` text NOT NULL,
  `Group_Name_Eng` text NOT NULL,
  `Co_Advisor` varchar(30) DEFAULT NULL,
  `Major` int(11) DEFAULT NULL,
  `Group_Status` int(11) NOT NULL DEFAULT 1,
  `Group_Progression` int(11) NOT NULL DEFAULT 2,
  `Project_on_term_ID` int(11) NOT NULL,
  `Grade` varchar(2) DEFAULT NULL,
  `Is_Re_Eval` int(1) NOT NULL DEFAULT 0,
  `Received_New_Grade` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `majors`
--

CREATE TABLE `majors` (
  `Major_ID` int(11) NOT NULL,
  `Major_Name` varchar(50) NOT NULL,
  `Acronym` varchar(10) NOT NULL,
  `Major_Status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `majors`
--

INSERT INTO `majors` (`Major_ID`, `Major_Name`, `Acronym`, `Major_Status`) VALUES
(1, 'Information Technology', 'IT', 1),
(2, 'Computer Science and Innovation', 'CSI', 1),
(3, 'Multimedia Technology and Animation', 'MTA', 1),
(4, 'Software Engineering', 'SE', 1),
(5, 'Information and Communication Engineering', 'ICE', 1),
(6, 'Computer Engineering', 'CE', 1),
(7, 'Digital Technology for Business Innovation', 'DTBI', 1),
(99, 'admin', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `progressions`
--

CREATE TABLE `progressions` (
  `Progress_ID` int(11) NOT NULL,
  `Progress_Name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `progressions`
--

INSERT INTO `progressions` (`Progress_ID`, `Progress_Name`) VALUES
(1, 'Group'),
(2, 'Proposal'),
(3, 'Progress 1'),
(4, 'Progress 2'),
(5, 'Progress 3'),
(6, 'Progress 4'),
(7, 'Final Presentation'),
(8, 'Final Documentation'),
(9, 'Evaluation'),
(10, 'Re-Evaluation');

-- --------------------------------------------------------

--
-- Table structure for table `projectonterm`
--

CREATE TABLE `projectonterm` (
  `Project_on_term_ID` int(11) NOT NULL,
  `Academic_Year` int(4) NOT NULL,
  `Academic_Term` int(1) NOT NULL,
  `Access_Date_Start` date NOT NULL,
  `Access_Date_End` date NOT NULL,
  `Senior` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projectonterm`
--

INSERT INTO `projectonterm` (`Project_on_term_ID`, `Academic_Year`, `Academic_Term`, `Access_Date_Start`, `Access_Date_End`, `Senior`) VALUES
(15, 2021, 1, '2022-01-01', '2022-06-04', 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `Role_ID` int(11) NOT NULL,
  `Role_Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`Role_ID`, `Role_Name`) VALUES
(0, 'Teacher'),
(1, 'Student'),
(2, 'Coordinator'),
(99, 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `scorecriterias`
--

CREATE TABLE `scorecriterias` (
  `Score_criteria_ID` int(11) NOT NULL,
  `Advisor_Score` int(11) DEFAULT 0,
  `Committee_Score` int(11) DEFAULT 0,
  `DueDate_Start` timestamp NOT NULL DEFAULT current_timestamp(),
  `DueDate_End` timestamp NOT NULL DEFAULT current_timestamp(),
  `Major_ID` int(11) NOT NULL,
  `Progress_ID` int(11) NOT NULL,
  `Project_on_term_ID` int(11) NOT NULL,
  `Status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `Score_ID` int(11) NOT NULL,
  `Score` float NOT NULL,
  `Max_Score` float NOT NULL,
  `Comment` text NOT NULL,
  `Group_Member_ID` int(11) NOT NULL,
  `Assignment_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `subroles`
--

CREATE TABLE `subroles` (
  `Sub_Role_ID` int(11) NOT NULL,
  `Sub_Role_Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `subroles`
--

INSERT INTO `subroles` (`Sub_Role_ID`, `Sub_Role_Name`) VALUES
(0, 'Advisor'),
(1, 'Committee'),
(2, 'Student'),
(3, 'Head');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_Email` varchar(40) NOT NULL,
  `User_Identity_ID` varchar(11) DEFAULT NULL,
  `User_Name` text NOT NULL,
  `User_Role` int(1) NOT NULL,
  `Course_code` varchar(8) DEFAULT NULL,
  `Major_ID` int(11) NOT NULL,
  `Project_on_term_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_Email`, `User_Identity_ID`, `User_Name`, `User_Role`, `Course_code`, `Major_ID`, `Project_on_term_ID`) VALUES
('6131302005@lamduan.mfu.ac.th', '6131302005', 'pipat massri', 1, NULL, 1, 15),
('6131501026@lamduan.mfu.ac.th', '6131501026', 'Nuttapong Samipak', 1, NULL, 6, 15),
('6131501037@lamduan.mfu.ac.th', '6131501037', 'Pronpom Kumthong', 1, NULL, 6, 15),
('6131501042@lamduan.mfu.ac.th', '6131501042', 'Pornsupa Sombatsiri', 1, NULL, 6, 15),
('6131501049@lamduan.mfu.ac.th', '6131501049', 'Rujikorn Precha', 1, NULL, 6, 15),
('6131501052@lamduan.mfu.ac.th', '6131501052', 'Wachirachai Nitsomboon', 1, NULL, 2, 15),
('cickpoo0121@gmail.com', NULL, 'Cickpool', 2, NULL, 1, 15),
('cickpoo0123@gmail.com', NULL, 'Cickpool2', 99, NULL, 1, 15),
('kiwlom093@gmail.com', '6131501097', 'Coordinator Kiwlom', 2, NULL, 2, 15),
('nitsomboon77@gmail.com', NULL, 'Ajarn Nitsomboon', 0, NULL, 1, 15),
('oscarstones093@gmail.com', NULL, 'Admin Guy', 1, NULL, 1, 15),
('sootarin@gmail.com', NULL, 'Sootarin Noopap', 0, NULL, 7, 15),
('surapol_mfu@gmail.com', NULL, 'Surapol Vorapatratorn', 0, NULL, 6, 15),
('wachirachai.n@appman.co.th', '6131501055', 'Student Nitsomboon', 1, '1302492', 1, 15);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abstracts`
--
ALTER TABLE `abstracts`
  ADD PRIMARY KEY (`Abstract_ID`),
  ADD KEY `Group_ID` (`Group_ID`),
  ADD KEY `Project_on_term_ID` (`Project_on_term_ID`);

--
-- Indexes for table `academicyear`
--
ALTER TABLE `academicyear`
  ADD PRIMARY KEY (`Academic_Year`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`Announcement_ID`),
  ADD KEY `Major_ID` (`Major_ID`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`Assignment_ID`),
  ADD KEY `Progress_ID` (`Progress_ID`),
  ADD KEY `Group_ID` (`Group_ID`);

--
-- Indexes for table `evalcomment`
--
ALTER TABLE `evalcomment`
  ADD PRIMARY KEY (`Eval_Comment_ID`),
  ADD KEY `Group_Member_ID` (`Group_Member_ID`),
  ADD KEY `Group_ID` (`Group_ID`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`File_ID`),
  ADD KEY `Assignment_ID` (`Assignment_ID`),
  ADD KEY `Group_Member_ID` (`Group_Member_ID`);

--
-- Indexes for table `gradecriterias`
--
ALTER TABLE `gradecriterias`
  ADD PRIMARY KEY (`Grade_Criteria_ID`),
  ADD KEY `Major_ID` (`Major_ID`),
  ADD KEY `Project_on_term_ID` (`Project_on_term_ID`);

--
-- Indexes for table `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD PRIMARY KEY (`Group_Member_ID`),
  ADD KEY `User_Email` (`User_Email`),
  ADD KEY `Group_ID` (`Group_ID`),
  ADD KEY `Group_Role` (`Group_Role`),
  ADD KEY `Project_on_term_ID` (`Project_on_term_ID`),
  ADD KEY `User_Status` (`User_Status`);

--
-- Indexes for table `groupmemberstatus`
--
ALTER TABLE `groupmemberstatus`
  ADD PRIMARY KEY (`Member_Status_ID`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`Group_ID`),
  ADD KEY `Major` (`Major`),
  ADD KEY `Project_on_term_ID` (`Project_on_term_ID`),
  ADD KEY `Group_Progression` (`Group_Progression`);

--
-- Indexes for table `majors`
--
ALTER TABLE `majors`
  ADD PRIMARY KEY (`Major_ID`);

--
-- Indexes for table `progressions`
--
ALTER TABLE `progressions`
  ADD PRIMARY KEY (`Progress_ID`);

--
-- Indexes for table `projectonterm`
--
ALTER TABLE `projectonterm`
  ADD PRIMARY KEY (`Project_on_term_ID`),
  ADD KEY `Academic_Year` (`Academic_Year`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Role_ID`);

--
-- Indexes for table `scorecriterias`
--
ALTER TABLE `scorecriterias`
  ADD PRIMARY KEY (`Score_criteria_ID`),
  ADD KEY `scorecriterias_ibfk_1` (`Progress_ID`),
  ADD KEY `Major_ID` (`Major_ID`),
  ADD KEY `Project_on_term_ID` (`Project_on_term_ID`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`Score_ID`),
  ADD KEY `Group_Member_ID` (`Group_Member_ID`),
  ADD KEY `Assignment_ID` (`Assignment_ID`);

--
-- Indexes for table `subroles`
--
ALTER TABLE `subroles`
  ADD PRIMARY KEY (`Sub_Role_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_Email`,`Project_on_term_ID`),
  ADD KEY `Major_ID` (`Major_ID`),
  ADD KEY `Project_on_term_ID` (`Project_on_term_ID`),
  ADD KEY `User_Role` (`User_Role`);
ALTER TABLE `users` ADD FULLTEXT KEY `User_Identity_ID` (`User_Identity_ID`);
ALTER TABLE `users` ADD FULLTEXT KEY `User_Identity_ID_2` (`User_Identity_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abstracts`
--
ALTER TABLE `abstracts`
  MODIFY `Abstract_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `Announcement_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `Assignment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evalcomment`
--
ALTER TABLE `evalcomment`
  MODIFY `Eval_Comment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `File_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gradecriterias`
--
ALTER TABLE `gradecriterias`
  MODIFY `Grade_Criteria_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groupmembers`
--
ALTER TABLE `groupmembers`
  MODIFY `Group_Member_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `Group_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `majors`
--
ALTER TABLE `majors`
  MODIFY `Major_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `progressions`
--
ALTER TABLE `progressions`
  MODIFY `Progress_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `projectonterm`
--
ALTER TABLE `projectonterm`
  MODIFY `Project_on_term_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `Role_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `scorecriterias`
--
ALTER TABLE `scorecriterias`
  MODIFY `Score_criteria_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `Score_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subroles`
--
ALTER TABLE `subroles`
  MODIFY `Sub_Role_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `abstracts`
--
ALTER TABLE `abstracts`
  ADD CONSTRAINT `abstracts_ibfk_1` FOREIGN KEY (`Group_ID`) REFERENCES `groups` (`Group_ID`),
  ADD CONSTRAINT `abstracts_ibfk_2` FOREIGN KEY (`Project_on_term_ID`) REFERENCES `projectonterm` (`Project_on_term_ID`);

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`Major_ID`) REFERENCES `majors` (`Major_ID`);

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`Progress_ID`) REFERENCES `progressions` (`Progress_ID`),
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`Group_ID`) REFERENCES `groups` (`Group_ID`);

--
-- Constraints for table `evalcomment`
--
ALTER TABLE `evalcomment`
  ADD CONSTRAINT `evalcomment_ibfk_1` FOREIGN KEY (`Group_Member_ID`) REFERENCES `groupmembers` (`Group_Member_ID`),
  ADD CONSTRAINT `evalcomment_ibfk_2` FOREIGN KEY (`Group_ID`) REFERENCES `groups` (`Group_ID`);

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`Assignment_ID`) REFERENCES `assignments` (`Assignment_ID`),
  ADD CONSTRAINT `files_ibfk_2` FOREIGN KEY (`Group_Member_ID`) REFERENCES `groupmembers` (`Group_Member_ID`);

--
-- Constraints for table `gradecriterias`
--
ALTER TABLE `gradecriterias`
  ADD CONSTRAINT `gradecriterias_ibfk_1` FOREIGN KEY (`Major_ID`) REFERENCES `majors` (`Major_ID`),
  ADD CONSTRAINT `gradecriterias_ibfk_2` FOREIGN KEY (`Project_on_term_ID`) REFERENCES `projectonterm` (`Project_on_term_ID`);

--
-- Constraints for table `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD CONSTRAINT `groupmembers_ibfk_1` FOREIGN KEY (`User_Email`) REFERENCES `users` (`User_Email`),
  ADD CONSTRAINT `groupmembers_ibfk_3` FOREIGN KEY (`Group_Role`) REFERENCES `subroles` (`Sub_Role_ID`),
  ADD CONSTRAINT `groupmembers_ibfk_4` FOREIGN KEY (`Project_on_term_ID`) REFERENCES `projectonterm` (`Project_on_term_ID`),
  ADD CONSTRAINT `groupmembers_ibfk_5` FOREIGN KEY (`Group_ID`) REFERENCES `groups` (`Group_ID`),
  ADD CONSTRAINT `groupmembers_ibfk_6` FOREIGN KEY (`User_Status`) REFERENCES `groupmemberstatus` (`Member_Status_ID`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`Major`) REFERENCES `majors` (`Major_ID`),
  ADD CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`Project_on_term_ID`) REFERENCES `projectonterm` (`Project_on_term_ID`),
  ADD CONSTRAINT `groups_ibfk_3` FOREIGN KEY (`Group_Progression`) REFERENCES `progressions` (`Progress_ID`);

--
-- Constraints for table `projectonterm`
--
ALTER TABLE `projectonterm`
  ADD CONSTRAINT `projectonterm_ibfk_1` FOREIGN KEY (`Academic_Year`) REFERENCES `academicyear` (`Academic_Year`);

--
-- Constraints for table `scorecriterias`
--
ALTER TABLE `scorecriterias`
  ADD CONSTRAINT `Major_ID` FOREIGN KEY (`Major_ID`) REFERENCES `majors` (`Major_ID`),
  ADD CONSTRAINT `scorecriterias_ibfk_1` FOREIGN KEY (`Progress_ID`) REFERENCES `progressions` (`Progress_ID`),
  ADD CONSTRAINT `scorecriterias_ibfk_3` FOREIGN KEY (`Project_on_term_ID`) REFERENCES `projectonterm` (`Project_on_term_ID`);

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`Group_Member_ID`) REFERENCES `groupmembers` (`Group_Member_ID`),
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`Assignment_ID`) REFERENCES `assignments` (`Assignment_ID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`Major_ID`) REFERENCES `majors` (`Major_ID`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`Project_on_term_ID`) REFERENCES `projectonterm` (`Project_on_term_ID`),
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`User_Role`) REFERENCES `roles` (`Role_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
