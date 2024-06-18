import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VotingABI from '../contracts/VotingABI.json';

const Voting = () =>
{
    const [ account, setAccount ] = useState( '' );
    const [ contract, setContract ] = useState( null );
    const [ candidates, setCandidates ] = useState( [] );
    const [ selectedCandidate, setSelectedCandidate ] = useState( null );
    const [ message, setMessage ] = useState( '' );

    useEffect( () =>
    {
        async function loadBlockchainData()
        {
            try
            {
                if ( window.ethereum )
                {
                    console.log( "Loading" )
                    const web3 = new Web3( window.ethereum );
                    await window.ethereum.request( { method: 'eth_requestAccounts' } );
                    const accounts = await web3.eth.getAccounts();
                    setAccount( accounts[ 0 ] );

                    const networkId = await web3.eth.net.getId();
                    const networkData = VotingABI.networks[ networkId ];
                    if ( networkData )
                    {
                        const votingContract = new web3.eth.Contract( VotingABI.abi, networkData && networkData.address );
                        setContract( votingContract );
                        console.log( "Loading 2" )

                        const candidatesCount = await votingContract.methods.getCandidatesCount().call( {
                            from: accounts[ 0 ]
                        } );
                        console.log( "candidatesCount", candidatesCount )
                        let candidatesArray = [];
                        for ( let i = 1; i <= candidatesCount; i++ )
                        {
                            const candidate = await votingContract.methods.getCandidate( i ).call();
                            console.log( "candidate", candidate )
                            candidatesArray.push( candidate );
                        }
                        setCandidates( candidatesArray );
                    } else
                    {
                        window.alert( 'Voting contract not deployed to detected network.' );
                    }
                } else
                {
                    window.alert( 'Please install MetaMask.' );
                }

            } catch ( error )
            {
                console.log( error.message );
            }
        }

        loadBlockchainData();
    }, [] );

    const vote = async () =>
    {
        if ( selectedCandidate )
        {
            await contract.methods.vote( selectedCandidate ).send( { from: account } );
            setMessage( 'Thank you for voting!' );
        } else
        {
            setMessage( 'Please select a candidate.' );
        }
    };

    return (
        <div>
            <h1>Voting System</h1>
            <p>Account: { account }</p>
            <h2>Candidates</h2>
            <ul>
                { candidates.map( candidate => (
                    <li key={ candidate[ 0 ] }>
                        { candidate[ 1 ] } - { candidate[ 2 ] } votes
                        <button onClick={ () => setSelectedCandidate( candidate[ 0 ] ) }>Vote</button>
                    </li>
                ) ) }
            </ul>
            <button onClick={ vote }>Submit Vote</button>
            { message && <p>{ message }</p> }
        </div>
    );
};

export default Voting;
