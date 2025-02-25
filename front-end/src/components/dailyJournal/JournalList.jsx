import { Box, Center, Container, Flex, Spinner, Text, useBreakpointValue, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../services/axios';
import { JournalCard } from './JournalCard';
import { CRUDJournal } from './CRUDJournal';
import { LeftNav } from '../navbar/LeftNav';
import { JournalDetail } from './JournalDetail';
import { useColorMode } from '@chakra-ui/react';
import { HamburgerIcon, ViewIcon } from '@chakra-ui/icons';
import UserGuide from '../tutorial/Tutorial';

export const JournalList = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJournalId, setSelectedJournalId] = useState(null);
    const isMounted = useRef(false);
    const { colorMode } = useColorMode();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const mainWidth = isMobile ? "100%" : "40%";

    useEffect(() => {
        if (isMounted.current) return;
        fetchJournal();
        isMounted.current = true;

        // Check if user just logged in
        const hasSeenGuide = localStorage.getItem("hasSeenGuide");
        if (!hasSeenGuide) {
            setIsGuideOpen(true);
            localStorage.setItem("hasSeenGuide", "true");
        }
    }, [])

    const fetchJournal = () => {
        setLoading(true);
        axiosInstance.get('/journal/')
            .then((response) => {
                setJournals(response.data);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setLoading(false);
            });
    }

    const handleJournalSelect = (journalId) => {
        setSelectedJournalId(journalId);
    }

    return (
        <Flex h="100vh">
            {/* Popup Guide */}
            <Modal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Hướng Dẫn Sử Dụng</ModalHeader>
                    <ModalBody>
                        <UserGuide isInModal={true} />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={() => setIsGuideOpen(false)}>Đóng</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Mobile Navigation Button */}
            {isMobile && (
                <>
                    <IconButton
                        icon={<HamburgerIcon />}
                        position="fixed"
                        top={4}
                        left={4}
                        zIndex={20}
                        onClick={() => setIsNavOpen(true)}
                        aria-label="Open navigation"
                    />
                    {selectedJournalId && (
                        <IconButton
                            icon={<ViewIcon />}
                            position="fixed"
                            top={4}
                            right={4}
                            zIndex={20}
                            onClick={() => setIsDetailOpen(true)}
                            aria-label="View details"
                        />
                    )}
                </>
            )}

            {/* Left Navigation - Responsive */}
            {isMobile ? (
                <Drawer isOpen={isNavOpen} placement="left" onClose={() => setIsNavOpen(false)}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody p={0}>
                            <LeftNav isDrawer={true} />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Box w="15%">
                    <LeftNav />
                </Box>
            )}

            {/* Journal List Section */}
            <Container
                mt={isMobile ? 16 : 9}
                w={mainWidth}
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                justify="center"
                align="center"
                px={isMobile ? 4 : 6}
            >
                <CRUDJournal onSuccess={fetchJournal} />
                {loading ? (
                    <Center mt={6}>
                        <Spinner thickness='4px' speed='0.5s' emptyColor='green.100' color="green.100" />
                    </Center>
                ) : (
                    <Box mt={6}>
                        {journals?.map((journal) => (
                            <JournalCard
                                journal={journal}
                                key={journal.journal_id}
                                isSelected={selectedJournalId === journal.journal_id}
                                onSelect={(id) => {
                                    handleJournalSelect(id);
                                    if (isMobile) setIsDetailOpen(true);
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Container>

            {/* Journal Detail Section - Responsive */}
            {isMobile ? (
                <Drawer
                    isOpen={isDetailOpen}
                    placement="right"
                    size="full"
                    onClose={() => setIsDetailOpen(false)}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody p={4} mt={8}>
                            {selectedJournalId ? (
                                <JournalDetail
                                    journalId={selectedJournalId}
                                    onUpdate={() => {
                                        fetchJournal();
                                        setIsDetailOpen(false);
                                    }}
                                />
                            ) : (
                                <Center h="100%" bg="brand.50" rounded="lg">
                                    <Text color="gray.500">Select a journal to view details</Text>
                                </Center>
                            )}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Box w="45%" mt={9} pr={4}>
                    {selectedJournalId ? (
                        <JournalDetail journalId={selectedJournalId} onUpdate={fetchJournal} />
                    ) : (
                        <Center h="100%" bg="brand.50" rounded="lg">
                            <Text color="gray.500">Nhấn vào nhật ký để xem chi tiết</Text>
                        </Center>
                    )}
                </Box>
            )}
        </Flex>
    )
}
